import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate

# Load environment variables
load_dotenv()

# Initialize the LLM
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o",
    temperature=0.1,
)

print("📝 Understanding Prompt Templates")
print("=" * 50)

# Example 1: Basic Prompt Template (using ChatPromptTemplate for modern API)
print("\n--- Example 1: Basic Prompt Template ---")
basic_template = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("human", "Hello {name}! Can you explain {topic} to me?")
])

chain = basic_template | llm
response = chain.invoke({"name": "Vikkas", "topic": "machine learning"})
answer = response.content if hasattr(response, 'content') else str(response)
print(f"Response: {answer}")

# Example 2: Chat Prompt Template
print("\n--- Example 2: Chat Prompt Template ---")
chat_template = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant that explains complex topics simply."),
    ("human", "Explain {topic} to someone who is a {level}")
])

chain = chat_template | llm
response = chain.invoke({"topic": "quantum computing", "level": "beginner"})
answer = response.content if hasattr(response, 'content') else str(response)
print(f"Response: {answer}")

# Example 3: Few-Shot Prompt Template
print("\n--- Example 3: Few-Shot Prompt Template ---")
few_shot_template = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant that provides clear explanations."),
    ("human", """Examples of good explanations:
    
    Input: Python
    Output: Python is a programming language that's easy to learn and powerful.
    
    Input: AI
    Output: AI (Artificial Intelligence) is technology that makes machines smart.
    
    Input: {input}
    Output:""")
])

chain = few_shot_template | llm
response = chain.invoke({"input": "Blockchain"})
answer = response.content if hasattr(response, 'content') else str(response)
print(f"Response: {answer}")