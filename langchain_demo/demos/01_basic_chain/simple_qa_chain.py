import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

# Step 1: Initialize the LLM
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o",
    temperature=0.1,
)

# Step 2: Create a Prompt Template (using modern LCEL syntax)
prompt_template = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Answer questions clearly and concisely."),
    ("human", "{question}")
])

# Step 3: Create a Chain using LCEL (LangChain Expression Language)
chain = prompt_template | llm

# Step 4: Test the Chain
if __name__ == "__main__":
    print("🎯 Simple Q&A Chain")
    print("=" * 50)
    
    # Test questions
    questions = [
        "What is Python?",
        "Explain machine learning in one sentence.",
        "What is the capital of France?"
    ]
    
    for i, question in enumerate(questions, 1):
        print(f"\n--- Question {i} ---")
        print(f"Q: {question}")
        
        # Run the chain (using invoke for modern LCEL)
        response = chain.invoke({"question": question})
        
        # Extract content from AIMessage
        answer = response.content if hasattr(response, 'content') else str(response)
        print(f"A: {answer}")