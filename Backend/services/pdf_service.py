from fastapi import UploadFile
from sqlalchemy.orm import Session
from models.database import Document, User
from database.vector_db import VectorDB
from utils.document_processor import DocumentProcessor
from utils.text_splitter import TextSplitter
import uuid
from typing import List

class PDFService:
    def __init__(self):
        self.vector_db = VectorDB()
        self.text_splitter = TextSplitter()
        self.doc_processor = DocumentProcessor()
    
    async def process_document(self, file: UploadFile, user_id: int, subject: str, db: Session) -> Document:
        """Process uploaded document and store in database"""
        
        # Read file content
        content = await file.read()
        
        # Extract text based on file type
        text_content, file_type = await self.doc_processor.process_document(content, file.filename)
        
        if not text_content.strip():
            raise Exception("No text content could be extracted from the document")
        
        # Create vector database collection
        collection_name = f"doc_{uuid.uuid4().hex}"
        collection = self.vector_db.create_collection(collection_name)
        
        # Split text into chunks
        chunks = self.text_splitter.split_text(text_content)
        
        # Save document to database
        document = Document(
            filename=file.filename,
            file_type=file_type,
            subject=subject,
            text_content=text_content,
            vector_db_id=collection_name,
            user_id=user_id
        )
        
        db.add(document)
        db.commit()
        db.refresh(document)

        # Store chunks in vector database
        metadatas = [{"chunk_index": i, "document_id": document.id} for i in range(len(chunks))]
        self.vector_db.add_documents(collection_name, chunks, metadatas)
        
        return document
    
    def get_user_documents(self, user_id: int, db: Session) -> List[Document]:
        """Get all documents for a user"""
        return db.query(Document).filter(Document.user_id == user_id).all()
    
    def get_all_documents(self, db: Session) -> List[Document]:
        """Get all documents"""
        return db.query(Document).all()

    def get_document_by_id(self, document_id: int, db: Session) -> Document:
        """Get document by ID"""
        return db.query(Document).filter(Document.id == document_id).first()
