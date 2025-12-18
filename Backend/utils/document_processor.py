import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import docx
from typing import Tuple, Optional
import io
import tempfile
import os

class DocumentProcessor:
    
    @staticmethod
    async def extract_text_from_pdf(file_content: bytes) -> str:
        """Extract text from PDF using PyMuPDF"""
        try:
            doc = fitz.open(stream=file_content, filetype="pdf")
            text = ""
            
            for page_num in range(doc.page_count):
                page = doc[page_num]
                text += page.get_text()
            
            doc.close()
            return text.strip()
        except Exception as e:
            raise Exception(f"Error extracting PDF text: {str(e)}")
    
    @staticmethod
    async def extract_text_from_image(file_content: bytes) -> str:
        """Extract text from image using OCR"""
        try:
            image = Image.open(io.BytesIO(file_content))
            text = pytesseract.image_to_string(image)
            return text.strip()
        except Exception as e:
            raise Exception(f"Error extracting image text: {str(e)}")
    
    @staticmethod
    async def extract_text_from_docx(file_content: bytes) -> str:
        """Extract text from DOCX file"""
        try:
            with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
                tmp_file.write(file_content)
                tmp_file.flush()
                
                doc = docx.Document(tmp_file.name)
                text = ""
                
                for paragraph in doc.paragraphs:
                    text += paragraph.text + "\n"
                
                os.unlink(tmp_file.name)
                return text.strip()
        except Exception as e:
            raise Exception(f"Error extracting DOCX text: {str(e)}")
    
    @staticmethod
    async def process_document(file_content: bytes, filename: str) -> Tuple[str, str]:
        """Process document and extract text based on file type"""
        file_extension = filename.lower().split('.')[-1]
        
        if file_extension == 'pdf':
            text = await DocumentProcessor.extract_text_from_pdf(file_content)
            return text, 'pdf'
        elif file_extension in ['jpg', 'jpeg', 'png', 'bmp', 'tiff']:
            text = await DocumentProcessor.extract_text_from_image(file_content)
            return text, 'image'
        elif file_extension in ['docx', 'doc']:
            text = await DocumentProcessor.extract_text_from_docx(file_content)
            return text, 'docx'
        else:
            # Try to decode as text
            try:
                text = file_content.decode('utf-8')
                return text, 'text'
            except:
                raise Exception(f"Unsupported file type: {file_extension}")