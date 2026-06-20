Project Name:
AI Portfolio Chatbot

Description:
An AI-powered portfolio assistant that allows recruiters and visitors to interactively learn about Aditya Pal through natural language conversations.

Problem Solved:
Traditional resumes are static and require recruiters to manually search for information. This chatbot provides an interactive way to explore Aditya's education, experience, skills, and projects.

Technology Stack:
- Python
- Flask
- ChromaDB
- Ollama
- Qwen
- RAG (Retrieval-Augmented Generation)
- HTML
- CSS
- JavaScript

Features:
- Answers questions about Aditya's education
- Explains work experience
- Describes technical skills
- Shares project information
- Uses semantic search through vector embeddings
- Retrieves relevant information using ChromaDB
- Generates natural language responses using Qwen

Architecture:
User Question → Embedding → ChromaDB Search → Context Retrieval → Qwen LLM → Response

Deployment:
Localhost deployment using Flask and Ollama.

Future Improvements:
- Voice interaction
- Resume PDF ingestion
- Project image gallery
- GitHub integration
- LinkedIn integration
- Multi-language support