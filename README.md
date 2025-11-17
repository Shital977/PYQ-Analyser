# PYQ-Analyser
PYQ Analyzer is a web application designed to facilitate intelligent interaction with previous year question papers (PYQs). It enables users to upload academic documents, process their content, and query them through natural language questions.


Overview
The system processes uploaded question papers to extract meaningful information and creates an indexed knowledge base. Users interact with this knowledge base via a chat-like interface, allowing efficient retrieval of relevant answers grounded in the uploaded materials.


Key Concepts
1.Document Ingestion: Multiple documents can be uploaded simultaneously, parsed, and pre-processed to facilitate semantic understanding.
2.Natural Language Querying: Users submit questions in free text, which are interpreted against the processed content to generate contextual answers.
3.Conversational UI: A chat interface mimics human dialogue, supporting iterative questioning and displaying the interaction history.
4.Frontend-Backend Architecture: The frontend handles user interaction and presentation, while the backend executes processing, indexing, and response generation, using APIs to connect the two.


Architecture
*Frontend: Implements responsive UI components for file upload, question input, and conversation display using HTML, CSS, and JavaScript.
*Backend: Utilizes FastAPI to manage file processing, data indexing, and question-answering logic, exposing RESTful endpoints for client communication.


Benefits
*Streamlines academic revision by enabling focused queries over voluminous question papers.
*Enhances study efficiency by transforming static documents into interactive knowledge resources.
*Provides an extensible framework adaptable to other document types or knowledge domains.


Usage Summary
1.Upload question papers.
2.Process and index uploaded content.
3.Submit natural language questions.
4.Review conversational answers.
5.Manage chat history as needed.


Technologies
*Python, FastAPI (Backend)
*HTML, CSS, JavaScript (Frontend)
