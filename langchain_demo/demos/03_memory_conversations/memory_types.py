import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

# Load environment variables
load_dotenv()

# Initialize the LLM
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o",
    temperature=0.1,
)

print("🧠 Understanding Memory Types")
print("=" * 50)

# Example 1: ConversationBufferMemory (remembers everything)
print("\n--- Example 1: ConversationBufferMemory ---")
buffer_memory = InMemoryChatMessageHistory()
prompt = ChatPromptTemplate.from_messages([
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])
chain = prompt | llm

print("User: My name is Vikkas")
buffer_memory.add_user_message("My name is Vikkas")
response = chain.invoke({
    "history": buffer_memory.messages,
    "input": "My name is Vikkas"
})
buffer_memory.add_ai_message(response)

print("\nUser: What's my name?")
response = chain.invoke({
    "history": buffer_memory.messages,
    "input": "What's my name?"
})
answer = response.content if hasattr(response, 'content') else str(response)
print(f"AI: {answer}")

# Example 2: ConversationBufferWindowMemory (remembers last 2 messages)
print("\n--- Example 2: ConversationBufferWindowMemory ---")
window_memory = InMemoryChatMessageHistory()
prompt = ChatPromptTemplate.from_messages([
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])
chain = prompt | llm

print("User: I like Python")
window_memory.add_user_message("I like Python")
response = chain.invoke({
    "history": window_memory.messages[-2:] if len(window_memory.messages) > 2 else window_memory.messages,
    "input": "I like Python"
})
window_memory.add_ai_message(response)

print("\nUser: I also like JavaScript")
window_memory.add_user_message("I also like JavaScript")
# Keep only last 2 messages for window memory
if len(window_memory.messages) > 4:
    window_memory.messages = window_memory.messages[-4:]
response = chain.invoke({
    "history": window_memory.messages[-2:] if len(window_memory.messages) > 2 else window_memory.messages,
    "input": "I also like JavaScript"
})
window_memory.add_ai_message(response)

print("\nUser: What programming languages do I like?")
# Keep only last 2 messages
if len(window_memory.messages) > 4:
    window_memory.messages = window_memory.messages[-4:]
response = chain.invoke({
    "history": window_memory.messages[-2:] if len(window_memory.messages) > 2 else window_memory.messages,
    "input": "What programming languages do I like?"
})
answer = response.content if hasattr(response, 'content') else str(response)
print(f"AI: {answer}")

# Example 3: ConversationSummaryMemory (simplified - using full history)
print("\n--- Example 3: ConversationSummaryMemory (Simplified) ---")
summary_memory = InMemoryChatMessageHistory()
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Remember previous conversations."),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])
chain = prompt | llm

print("User: I work in banking")
summary_memory.add_user_message("I work in banking")
response = chain.invoke({
    "history": summary_memory.messages,
    "input": "I work in banking"
})
summary_memory.add_ai_message(response)

print("\nUser: I deal with CRR regulations")
summary_memory.add_user_message("I deal with CRR regulations")
response = chain.invoke({
    "history": summary_memory.messages,
    "input": "I deal with CRR regulations"
})
summary_memory.add_ai_message(response)

print("\nUser: What do you know about me?")
response = chain.invoke({
    "history": summary_memory.messages,
    "input": "What do you know about me?"
})
answer = response.content if hasattr(response, 'content') else str(response)
print(f"AI: {answer}")