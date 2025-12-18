from sqlalchemy.orm import Session
from models.database import ChatHistory, Document
from database.vector_db import VectorDB
from utils.llm_client import LLMClient
from typing import List, Dict, Any

class ChatService:
    def __init__(self):
        self.vector_db = VectorDB()
        self.llm_client = LLMClient()
    
    async def chat_with_documents(self, user_id: int, message: str, document_ids: List[int], language: str, db: Session):
        """Chat with AI tutor using RAG from documents"""
        
        # Get documents
        documents = db.query(Document).filter(Document.id.in_(document_ids)).all()
        if not documents:
            raise Exception("No documents found")
        
        # Query relevant content from vector databases
        relevant_content = []
        for doc in documents:
            if doc.vector_db_id:
                try:
                    results = self.vector_db.query_documents(
                        doc.vector_db_id, 
                        message, 
                        n_results=3
                    )
                    if results['documents']:
                        relevant_content.extend(results['documents'][0])
                except:
                    continue
        
        # Combine relevant content
        context = "\n\n".join(relevant_content[:3])  # Limit context size
        
        # Generate response
        prompt = f"""
        You are an AI tutor. Answer the student's question based on the provided context.
        Explain concepts clearly and provide examples when helpful.
        If the question cannot be answered from the context, say so politely.
        
        Context from study materials:
        {context}
        
        Student question: {message}
        
        Please respond in {language} language.
        """
        
        response = await self.llm_client.generate_response(prompt)
        
        # Save chat history
        chat_record = ChatHistory(
            user_id=user_id,
            message=message,
            response=response,
            document_ids=document_ids,
            language=language
        )
        
        db.add(chat_record)
        db.commit()
        
        return {
            "response": response,
            "sources": [{"document_id": doc.id, "filename": doc.filename} for doc in documents],
            "language": language
        }
    
    def get_chat_history(self, user_id: int, limit: int, db: Session) -> List[Dict[str, Any]]:
        """Get chat history for user"""
        
        history = db.query(ChatHistory).filter(
            ChatHistory.user_id == user_id
        ).order_by(ChatHistory.timestamp.desc()).limit(limit).all()
        
        return [
            {
                "message": chat.message,
                "response": chat.response,
                "timestamp": chat.timestamp,
                "language": chat.language
            }
            for chat in history
        ]