from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings
import os
import json
from typing import List, Dict, Any
from dotenv import load_dotenv
from pathlib import Path

class LLMClient:
    def __init__(self):
        # Explicitly load .env from the parent directory (Backend)
        env_path = Path(__file__).parent.parent / ".env"
        load_dotenv(dotenv_path=env_path)
        
        api_key = os.getenv("GROQ_API_KEY")
        if api_key:
            api_key = api_key.strip() # Remove any leading/trailing whitespace
            masked_key = f"{api_key[:4]}...{api_key[-4:]}"
            print(f"DEBUG: Loaded GROQ_API_KEY: {masked_key}")
        else:
            print("DEBUG: GROQ_API_KEY is None or Empty")

        # Configure Groq API using langchain_groq
        self.client = ChatGroq(
            groq_api_key=api_key,
            model_name=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
            temperature=0.3
        )
        
        # Initialize embeddings model
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"}
        )
    
    async def generate_response(self, prompt: str, context: str = "") -> str:
        """Generate response using Groq"""
        full_prompt = f"{context}\n\n{prompt}" if context else prompt
        
        try:
            response = self.client.invoke(full_prompt)
            return response.content
        except Exception as e:
            raise Exception(f"Error generating response: {str(e)}")
    
    async def generate_quiz_questions(self, content: str, num_questions: int, difficulty: str) -> List[Dict[str, Any]]:
        """Generate quiz questions from content"""
        prompt = f"""
        Create {num_questions} multiple-choice questions from the following content.
        Difficulty level: {difficulty}
        
        Format each question as JSON with this structure:
        {{
            "question": "Question text?",
            "options": {{ "A": "Option 1", "B": "Option 2", "C": "Option 3", "D": "Option 4" }},
            "correct_answer": "A",
            "explanation": "Why this answer is correct"
        }}
        
        Content:
        {content}
        
        Return only a valid JSON array of questions, no other text.
        """
        
        response = await self.generate_response(prompt)
        try:
            # Clean the response to extract JSON
            response = response.strip()
            if response.startswith('```json'):
                response = response[7:]
            if response.endswith('```'):
                response = response[:-3]
            response = response.strip()
            
            questions = json.loads(response)
            return questions
        except Exception as e:
            print(f"JSON parsing error: {e}")
            # Fallback parsing
            return self._parse_questions_fallback(response, num_questions)
    
    async def generate_flashcards(self, content: str, num_cards: int) -> List[Dict[str, str]]:
        """Generate flashcards from content"""
        prompt = f"""
        Create {num_cards} flashcards from the following content.
        Each flashcard should have a clear question and concise answer.
        
        Format as JSON array:
        [
            {{"question": "Q1?", "answer": "A1"}},
            {{"question": "Q2?", "answer": "A2"}}
        ]
        
        Content:
        {content}
        
        Return only a valid JSON array, no other text.
        """
        
        response = await self.generate_response(prompt)
        try:
            # Clean the response to extract JSON
            response = response.strip()
            if response.startswith('```json'):
                response = response[7:]
            if response.endswith('```'):
                response = response[:-3]
            response = response.strip()
            
            cards = json.loads(response)
            return cards
        except Exception as e:
            print(f"JSON parsing error: {e}")
            return self._parse_flashcards_fallback(response, num_cards)
    
    async def generate_summary(self, content: str, summary_type: str, language: str) -> str:
        """Generate summary of content"""
        type_prompts = {
            "short": "Create a concise 2-3 sentence summary",
            "detailed": "Create a detailed summary with main points and supporting details",
            "bullet_points": "Create a bullet-point summary with key concepts"
        }
        
        language_map = {
            "en": "English",
            "hi": "Hindi",
            "mr": "Marathi"
        }
        
        language_name = language_map.get(language, "English")
        
        prompt = f"""
        {type_prompts.get(summary_type, type_prompts['detailed'])} of the following content in {language_name}.
        
        Content:
        {content}
        """
        
        return await self.generate_response(prompt)
    
    async def generate_mindmap_data(self, content: str, topic: str) -> Dict[str, Any]:
        """Generate mind map structure from content"""
        prompt = f"""
        Create a mind map structure for the topic "{topic}" based on the following content.
        
        Return a JSON object with:
        - "nodes": array of objects with {{id, label, level, x, y}} where level 0 is center
        - "edges": array of objects with {{source, target, label}}
        
        Keep it organized with max 3 levels and logical positioning.
        Position nodes in a radial layout around the center.
        
        Content:
        {content}
        
        Return only valid JSON, no other text.
        """
        
        response = await self.generate_response(prompt)
        try:
            # Clean the response to extract JSON
            response = response.strip()
            if response.startswith('```json'):
                response = response[7:]
            if response.endswith('```'):
                response = response[:-3]
            response = response.strip()
            
            return json.loads(response)
        except Exception as e:
            print(f"JSON parsing error: {e}")
            # Return basic structure if parsing fails
            return {
                "nodes": [
                    {"id": "1", "label": topic, "level": 0, "x": 0, "y": 0}
                ],
                "edges": []
            }
    
    async def generate_chat_response(self, message: str, context: str = "", language: str = "en") -> str:
        """Generate chat response with context"""
        language_map = {
            "en": "English",
            "hi": "Hindi", 
            "mr": "Marathi"
        }
        
        language_name = language_map.get(language, "English")
        
        prompt = f"""
        You are an AI tutor. Answer the student's question based on the provided context.
        Explain concepts clearly and provide examples when helpful.
        If the question cannot be answered from the context, say so politely and provide general guidance.
        
        Context from study materials:
        {context}
        
        Student question: {message}
        
        Please respond in {language_name}.
        """
        
        return await self.generate_response(prompt)
    
    def _parse_questions_fallback(self, response: str, num_questions: int) -> List[Dict[str, Any]]:
        """Fallback question parsing if JSON fails"""
        questions = []
        for i in range(num_questions):
            questions.append({
                "question": f"Sample question {i+1} based on the content?",
                "options": {
                    "A": "Option A", 
                    "B": "Option B", 
                    "C": "Option C", 
                    "D": "Option D"
                },
                "correct_answer": "A",
                "explanation": "This is a fallback question due to parsing error."
            })
        return questions
    
    def _parse_flashcards_fallback(self, response: str, num_cards: int) -> List[Dict[str, str]]:
        """Fallback flashcard parsing if JSON fails"""
        cards = []
        for i in range(num_cards):
            cards.append({
                "question": f"Sample question {i+1}?",
                "answer": f"Sample answer {i+1}"
            })
        return cards

llm_client = LLMClient()
