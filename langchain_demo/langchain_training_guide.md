# 🎓 LangChain Complete Training Guide

---

## 📚 Table of Contents

1. [**Introduction & Setup**](#1-introduction--setup)
2. [**Core Concepts**](#2-core-concepts)
3. [**Building Your First Chain**](#3-building-your-first-chain)
4. [**Prompts & Templates**](#4-prompts--templates)
5. [**Memory & Conversations**](#5-memory--conversations)


6. [**Tools & Agents**](#6-tools--agents)
7. [**Document Loading & Processing**](#7-document-loading--processing)
8. [**Vector Stores & Embeddings**](#8-vector-stores--embeddings)
9. [**RAG Implementation**](#9-rag-implementation)
10. [**Real-World Project**](#10-real-world-project)
11. [**Advanced Topics**](#11-advanced-topics)

---

## 1. Introduction & Setup

### What is LangChain? 🤔
**Simple Explanation:** Think of LangChain as a toolbox for building AI applications. Just like a toolbox has different tools (hammer, screwdriver, wrench), LangChain provides different components (chains, prompts, memory, agents) that you can combine to build powerful AI applications.

**Technical Definition:** LangChain is an open-source framework for developing applications powered by language models, providing tools and abstractions for building AI applications.

### Why Use LangChain? 🎯
- **Modular Components:** Reusable building blocks for AI applications
- **Standardized Interfaces:** Consistent APIs across different LLM providers
- **Built-in Tools:** Pre-built tools for common tasks (search, calculation, etc.)
- **Memory Management:** Built-in conversation memory and context handling
- **Agent Capabilities:** Easy creation of AI agents with reasoning and tool usage
- **Production Ready:** Designed for scalable, production applications

### Prerequisites ✅
- Basic Python knowledge
- OpenAI API key (or Ollama for local models)
- Understanding of AI/LLM concepts

### Environment Setup 🛠️

#### Step 1: Create Virtual Environment
```bash
# Create directory
cd /Users/user/Desktop/AI/projects/genai_cohort3
mkdir langchain_demo
cd langchain_demo

# Create virtual environment
python3 -m venv venv 

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate
```

#### Step 2: Install Dependencies

```bash
touch requirements.txt
```

Add to `requirements.txt`:
```
langchain
langchain-core
langchain-openai
langchain-community
langchain-experimental
jupyter
ipykernel
python-dotenv
chromadb
tiktoken
numpy<2
```

Install packages:
```bash
pip3 install -r requirements.txt
```

#### Step 3: OpenAI Configuration

```bash
touch .env 
```

Create `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

#### Step 4: Test Setup

```bash
touch test_setup.py
```

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

# Load environment variables from .env file
load_dotenv()

# Get API key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    print("Error: OPENAI_API_KEY not found in .env file")
    print("Please make sure your .env file contains: OPENAI_API_KEY=your_actual_api_key_here")
    exit(1)

# Initialize model
model = ChatOpenAI(
    api_key=OPENAI_API_KEY,
    model="gpt-4o",
    max_tokens=512,
    temperature=0.1,
)

# Test connection
print("Testing OpenAI connection...")
msg = HumanMessage(content="Hi, how are you?")
response = model.invoke([msg])
print("Response:", response.content)
print("✅ Setup successful!")
```

```bash
python3 test_setup.py
```

**Expected Output:**
```
Testing OpenAI connection...
Response: Hello! I'm just a computer program, so I don't have feelings, but I'm here and ready to help you. How can I assist you today?
✅ Setup successful!
```

---

# Create subdirectories for different demos
```bash
mkdir -p demos/01_basic_chain
mkdir -p demos/02_prompts_templates
mkdir -p demos/03_memory_conversations
mkdir -p demos/04_tools_agents
mkdir -p demos/05_document_processing
mkdir -p demos/06_vector_stores
mkdir -p demos/07_rag_implementation
mkdir -p demos/08_real_world_project
```

---

## 2. Core Concepts

### Understanding LangChain Components 🧩

**Simple Explanation:** LangChain is like building with LEGO blocks:
- **LLMs** = The brain that thinks
- **Chains** = The assembly line that connects steps
- **Prompts** = Instructions you give to the brain
- **Memory** = The notebook that remembers past conversations
- **Agents** = Smart workers that can use tools
- **Tools** = The tools workers can use (calculator, search, etc.)

### Key Components 🧩

#### 1. LLMs (Large Language Models)
**What it is:** The AI model that generates text
**Simple Example:** Like a very smart assistant that can answer questions

#### 2. Chains
**What they are:** Sequences of operations that process data step by step
**Simple Example:** Like a recipe: step 1 → step 2 → step 3 → result

#### 3. Prompts
**What they are:** Instructions and templates for the LLM
**Simple Example:** Like giving directions to someone

#### 4. Memory
**What it is:** Storage for conversation history and context
**Simple Example:** Like a notebook that remembers what you talked about

#### 5. Agents
**What they are:** LLMs that can use tools and make decisions
**Simple Example:** Like a smart assistant that can use a calculator, search the web, etc.

#### 6. Tools
**What they are:** Functions that agents can call (search, calculate, etc.)
**Simple Example:** Like tools in a toolbox that the assistant can use

---

## 3. Building Your First Chain

### Project: Simple Q&A Chain 🎯

**Goal:** Build a simple chain that takes a question and returns an answer.

**What it does:** This is like building your first simple AI assistant that can answer questions.

**Simple explanation:**
- You ask a question: "What is Python?"
- The chain processes it
- The AI gives you an answer

**Real-world analogy:** It's like asking a teacher a question and getting an answer.

```bash
cd demos/01_basic_chain
touch simple_qa_chain.py
```

```python
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
```

```bash
python3 simple_qa_chain.py
```

---

### Project: Sequential Chain 🔄

**Goal:** Build a chain that processes information in multiple steps.

**What it does:** This shows how to chain multiple operations together.

**Simple explanation:**
- Step 1: Generate a topic
- Step 2: Write a summary about that topic
- Step 3: Create a title for the summary

**Real-world analogy:** It's like an assembly line where each step builds on the previous one.

```bash
touch sequential_chain.py
```

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

# Initialize the LLM
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o",
    temperature=0.7,
)

# Step 1: Create the first chain (generate topic)
topic_template = ChatPromptTemplate.from_messages([
    ("system", "You are a creative topic generator."),
    ("human", "Generate an interesting topic about {subject}. Return only the topic name.")
])
topic_chain = topic_template | llm

# Step 2: Create the second chain (write summary)
summary_template = ChatPromptTemplate.from_messages([
    ("system", "You are a concise writer."),
    ("human", "Write a brief summary (2-3 sentences) about: {topic}")
])
summary_chain = summary_template | llm

# Step 3: Create the third chain (create title)
title_template = ChatPromptTemplate.from_messages([
    ("system", "You are a creative title writer."),
    ("human", "Create a catchy title for this summary: {summary}")
])
title_chain = title_template | llm

# Step 4: Combine chains sequentially using LCEL
def process_sequential(subject):
    """Process through all chains sequentially"""
    # Step 1: Generate topic
    topic_response = topic_chain.invoke({"subject": subject})
    topic = topic_response.content if hasattr(topic_response, 'content') else str(topic_response)
    
    # Step 2: Write summary
    summary_response = summary_chain.invoke({"topic": topic})
    summary = summary_response.content if hasattr(summary_response, 'content') else str(summary_response)
    
    # Step 3: Create title
    title_response = title_chain.invoke({"summary": summary})
    title = title_response.content if hasattr(title_response, 'content') else str(title_response)
    
    return title

# Step 5: Test the Sequential Chain
if __name__ == "__main__":
    print("🔄 Sequential Chain Demo")
    print("=" * 50)
    
    subjects = ["artificial intelligence", "space exploration", "renewable energy"]
    
    for subject in subjects:
        print(f"\n--- Processing: {subject} ---")
        result = process_sequential(subject)
        print(f"\nFinal Result: {result}")
        print("-" * 50)
```

```bash
python3 sequential_chain.py
```

---

## 4. Prompts & Templates

### Understanding Prompts 📝

**Simple Explanation:** Prompts are like instructions you give to the AI. The better your instructions, the better the AI's response.

**Real-world analogy:** It's like giving directions:
- Bad: "Go somewhere"
- Good: "Go to 123 Main Street, turn left at the traffic light, it's the blue building on the right"

### Basic Prompt Templates

```bash
cd ../02_prompts_templates
touch basic_prompts.py
```

```python
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
```

```bash
python3 basic_prompts.py
```

---

### Advanced Prompt Techniques

```bash
touch advanced_prompts.py
```

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

# Initialize the LLM
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o",
    temperature=0.1,
)

print("🚀 Advanced Prompt Techniques")
print("=" * 50)

# Example 1: Chain-of-Thought Prompting
print("\n--- Example 1: Chain-of-Thought Prompting ---")
cot_template = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant that solves problems step by step."),
    ("human", """Solve this problem step by step:
    
    Problem: {problem}
    
    Let's think through this step by step:
    1. First, I need to understand what's being asked
    2. Then, I'll identify the key information
    3. Next, I'll work through the solution
    4. Finally, I'll verify my answer
    
    Solution:""")
])

chain = cot_template | llm
response = chain.invoke({"problem": "If a train travels 60 miles per hour for 2.5 hours, how far does it travel?"})
answer = response.content if hasattr(response, 'content') else str(response)
print(f"Response: {answer}")

# Example 2: Role-Based Prompting
print("\n--- Example 2: Role-Based Prompting ---")
role_template = ChatPromptTemplate.from_messages([
    ("system", "You are a {role}. You have expertise in {expertise}."),
    ("human", "{question}")
])

chain = role_template | llm
response = chain.invoke({
    "role": "financial advisor",
    "expertise": "investment strategies and risk management",
    "question": "What should I know about investing in stocks?"
})
answer = response.content if hasattr(response, 'content') else str(response)
print(f"Response: {answer}")

# Example 3: Structured Output Prompting
print("\n--- Example 3: Structured Output Prompting ---")
structured_template = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant that provides structured information."),
    ("human", """Provide information about {topic} in the following format:
    
    Topic: [topic name]
    Definition: [brief definition]
    Key Points:
    1. [first key point]
    2. [second key point]
    3. [third key point]
    Example: [a practical example]
    
    Information:""")
])

chain = structured_template | llm
response = chain.invoke({"topic": "neural networks"})
answer = response.content if hasattr(response, 'content') else str(response)
print(f"Response: {answer}")
```

```bash
python3 advanced_prompts.py
```

---

## 5. Memory & Conversations

### Understanding Memory 🧠

**Simple Explanation:** Memory is like a notebook that remembers your conversation history so the AI can understand context.

**Real-world analogy:** It's like talking to someone who remembers what you discussed earlier in the conversation.

### Types of Memory

1. **ConversationBufferMemory** - Remembers everything
2. **ConversationBufferWindowMemory** - Remembers last N messages
3. **ConversationSummaryMemory** - Remembers summarized conversation
4. **ConversationTokenBufferMemory** - Remembers within token limit

```bash
cd ../03_memory_conversations
touch memory_types.py
```

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

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
```

```bash
python3 memory_types.py
```

---

### Building a Conversation Chatbot

```bash
touch conversation_chatbot.py
```

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Load environment variables
load_dotenv()

# Initialize the LLM
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o",
    temperature=0.7,
)

# Create memory
memory = InMemoryChatMessageHistory()

# Create prompt template with memory
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. You remember the conversation history and provide contextually relevant responses."),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}")
])

# Create conversation chain using LCEL
chain = prompt | llm

# Interactive conversation
if __name__ == "__main__":
    print("💬 Conversation Chatbot")
    print("=" * 50)
    print("Type 'exit' to end the conversation\n")
    
    while True:
        user_input = input("You: ")
        
        if user_input.lower() == 'exit':
            print("Goodbye!")
            break
        
        # Get chat history from memory
        chat_history = memory.messages
        
        # Invoke chain with memory
        response = chain.invoke({
            "chat_history": chat_history,
            "input": user_input
        })
        
        # Extract answer
        answer = response.content if hasattr(response, 'content') else str(response)
        
        # Save to memory
        memory.add_user_message(user_input)
        memory.add_ai_message(response)
        
        print(f"AI: {answer}\n")
```

```bash
python3 conversation_chatbot.py
```

---

## 6. Tools & Agents

### Understanding Tools 🔧

**Simple Explanation:** Tools are functions that agents can use to perform actions (like searching the web, calculating, etc.).

**Real-world analogy:** It's like giving a worker tools (calculator, phone, computer) so they can do their job better.

```bash
cd ../04_tools_agents
touch basic_tools.py
```

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.agents import create_openai_tools_agent, AgentExecutor
from langchain_core.tools import Tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Load environment variables
load_dotenv()

# Initialize the LLM
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o",
    temperature=0.1,
)

print("🔧 Understanding Tools")
print("=" * 50)

# Define custom tools
def search_web(query: str) -> str:
    """Search the web for information"""
    # In a real application, this would call a search API
    return f"Search results for: {query}"

def calculate(expression: str) -> str:
    """Perform mathematical calculations"""
    try:
        result = eval(expression)
        return f"Result: {result}"
    except Exception as e:
        return f"Error: {str(e)}"

def get_weather(location: str) -> str:
    """Get weather information for a location"""
    # In a real application, this would call a weather API
    return f"Weather in {location}: Sunny, 25°C"

# Create tools
tools = [
    Tool(
        name="Search",
        func=search_web,
        description="Search the web for current information. Input should be a search query."
    ),
    Tool(
        name="Calculator",
        func=calculate,
        description="Perform mathematical calculations. Input should be a mathematical expression."
    ),
    Tool(
        name="Weather",
        func=get_weather,
        description="Get weather information for a location. Input should be a city name."
    )
]

# Create prompt for agent
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant with access to tools."),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

# Create agent with tools
agent = create_openai_tools_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# Test the agent
if __name__ == "__main__":
    queries = [
        "What is 15 * 23?",
        "What's the weather in London?",
        "Search for information about Python programming"
    ]
    
    for query in queries:
        print(f"\n--- Query: {query} ---")
        response = agent_executor.invoke({"input": query})
        print(f"Response: {response['output']}")
```

```bash
python3 basic_tools.py
```

---

### Building an Agent with Memory

```bash
touch agent_with_memory.py
```

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.agents import create_openai_tools_agent, AgentExecutor
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.tools import Tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Load environment variables
load_dotenv()

# Initialize the LLM
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o",
    temperature=0.1,
)

# Create memory
memory = InMemoryChatMessageHistory()

# Define tools
def calculate(expression: str) -> str:
    """Perform mathematical calculations"""
    try:
        result = eval(expression)
        return str(result)
    except Exception as e:
        return f"Error: {str(e)}"

def get_date_info(query: str) -> str:
    """Get information about dates"""
    from datetime import datetime
    if "today" in query.lower():
        return f"Today is {datetime.now().strftime('%Y-%m-%d')}"
    elif "time" in query.lower():
        return f"Current time is {datetime.now().strftime('%H:%M:%S')}"
    return "Date information not available"

tools = [
    Tool(
        name="Calculator",
        func=calculate,
        description="Perform mathematical calculations. Input should be a mathematical expression."
    ),
    Tool(
        name="DateInfo",
        func=get_date_info,
        description="Get information about dates and time. Input should be a question about dates."
    )
]

# Create prompt for agent with memory
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant with access to tools. You remember previous conversations."),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

# Create agent with tools
agent = create_openai_tools_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, memory=memory)

# Test the agent
if __name__ == "__main__":
    print("🤖 Agent with Memory")
    print("=" * 50)
    
    conversation = [
        "My name is Vikkas",
        "What's 10 + 20?",
        "What's my name?",
        "What time is it?"
    ]
    
    for user_input in conversation:
        print(f"\nUser: {user_input}")
        response = agent_executor.invoke({"input": user_input, "chat_history": memory.messages})
        print(f"Agent: {response['output']}")
        # Update memory
        memory.add_user_message(user_input)
        memory.add_ai_message(response['output'])
```

```bash
python3 agent_with_memory.py
```

---

## 7. Document Loading & Processing

### Loading Documents 📄

**Simple Explanation:** LangChain can read different types of documents (PDFs, text files, web pages, etc.) and process them.

**Real-world analogy:** It's like having a smart assistant that can read any document and understand it.

```bash
cd ../05_document_processing
touch document_loader.py
```

```python
import os
from dotenv import load_dotenv
from langchain_community.document_loaders import (
    TextLoader,
    PyPDFLoader,
    WebBaseLoader,
    CSVLoader
)
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load environment variables
load_dotenv()

print("📄 Document Loading & Processing")
print("=" * 50)

# Example 1: Load Text File
print("\n--- Example 1: Load Text File ---")
try:
    # Create a sample text file
    with open("sample.txt", "w") as f:
        f.write("This is a sample text document. It contains multiple sentences. We can process it with LangChain.")
    
    loader = TextLoader("sample.txt")
    documents = loader.load()
    print(f"Loaded {len(documents)} document(s)")
    print(f"Content preview: {documents[0].page_content[:100]}...")
except Exception as e:
    print(f"Error: {e}")

# Example 2: Load PDF (requires PyPDF2)
print("\n--- Example 2: Load PDF ---")
print("Note: PDF loading requires PyPDF2. Install with: pip install pypdf2")
# Uncomment when PyPDF2 is installed:
# loader = PyPDFLoader("sample.pdf")
# documents = loader.load()

# Example 3: Load from Web
print("\n--- Example 3: Load from Web ---")
try:
    loader = WebBaseLoader("https://www.python.org/about/")
    documents = loader.load()
    print(f"Loaded {len(documents)} document(s) from web")
    print(f"Content preview: {documents[0].page_content[:200]}...")
except Exception as e:
    print(f"Error: {e}")

# Example 4: Text Splitting
print("\n--- Example 4: Text Splitting ---")
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=100,
    chunk_overlap=20,
    length_function=len
)

sample_text = """
LangChain is a framework for developing applications powered by language models.
It provides tools and abstractions for building AI applications.
You can use it to create chatbots, document Q&A systems, and more.
The framework is modular and easy to use.
"""

chunks = text_splitter.create_documents([sample_text])
print(f"Split text into {len(chunks)} chunks")
for i, chunk in enumerate(chunks, 1):
    print(f"\nChunk {i}:")
    print(chunk.page_content)
```

```bash
python3 document_loader.py
```

---

## 8. Vector Stores & Embeddings

### Understanding Embeddings 🧮

**Simple Explanation:** Embeddings convert text into numbers (vectors) that represent the meaning of the text. Similar texts have similar numbers.

**Real-world analogy:** It's like creating a map where similar words/concepts are close together.

```bash
cd ../06_vector_stores
touch embeddings_demo.py
```

```python
import os
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load environment variables
load_dotenv()

print("🧮 Understanding Embeddings & Vector Stores")
print("=" * 50)

# Initialize embeddings
embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))

# Example 1: Generate Embeddings
print("\n--- Example 1: Generate Embeddings ---")
texts = [
    "Python is a programming language",
    "Machine learning is a subset of AI",
    "LangChain helps build AI applications"
]

# Generate embeddings
text_embeddings = embeddings.embed_documents(texts)
print(f"Generated embeddings for {len(texts)} texts")
print(f"Embedding dimension: {len(text_embeddings[0])}")

# Example 2: Create Vector Store
print("\n--- Example 2: Create Vector Store ---")
# Create a persistent directory for the vector store
persist_directory = "./chroma_db"

# Create vector store
vectorstore = Chroma.from_texts(
    texts=texts,
    embedding=embeddings,
    persist_directory=persist_directory
)

print(f"Created vector store with {len(texts)} documents")

# Example 3: Similarity Search
print("\n--- Example 3: Similarity Search ---")
query = "What is Python?"
results = vectorstore.similarity_search(query, k=2)

print(f"Query: {query}")
print(f"Found {len(results)} similar documents:")
for i, result in enumerate(results, 1):
    print(f"\n{i}. {result.page_content}")

# Example 4: Similarity Search with Scores
print("\n--- Example 4: Similarity Search with Scores ---")
results_with_scores = vectorstore.similarity_search_with_score(query, k=2)

print(f"Query: {query}")
for i, (doc, score) in enumerate(results_with_scores, 1):
    print(f"\n{i}. Score: {score:.4f}")
    print(f"   Content: {doc.page_content}")
```

```bash
python3 embeddings_demo.py
```

---

## 9. RAG Implementation

### Building a RAG System 🔍

**Simple Explanation:** RAG (Retrieval Augmented Generation) combines document search with AI generation. It finds relevant information first, then uses it to generate answers.

**Real-world analogy:** It's like a student who:
1. Looks up information in textbooks (retrieval)
2. Reads the relevant sections (augmentation)
3. Writes an answer based on what they found (generation)

```bash
cd ../07_rag_implementation
touch rag_system.py
```

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

# Load environment variables
load_dotenv()

print("🔍 Building a RAG System")
print("=" * 50)

# Step 1: Prepare documents
documents = [
    """
    LangChain is a framework for developing applications powered by language models.
    It provides modular components for building AI applications including chains, agents, and memory.
    LangChain supports multiple LLM providers like OpenAI, Anthropic, and local models.
    """,
    """
    Vector stores are databases that store embeddings of documents.
    They enable semantic search by finding documents similar to a query.
    Popular vector stores include Chroma, Pinecone, and Weaviate.
    """,
    """
    RAG (Retrieval Augmented Generation) combines document retrieval with language generation.
    It retrieves relevant documents first, then uses them as context for generating answers.
    This approach improves accuracy and reduces hallucinations in AI responses.
    """
]

# Step 2: Split documents into chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=200,
    chunk_overlap=50
)

chunks = text_splitter.create_documents(documents)
print(f"Split documents into {len(chunks)} chunks")

# Step 3: Create embeddings and vector store
embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings
)
print("Created vector store")

# Step 4: Create LLM
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o",
    temperature=0.1
)

# Step 5: Create custom prompt template
prompt = ChatPromptTemplate.from_template("""
Use the following context to answer the question. If you don't know the answer, say so.

Context: {context}

Question: {input}

Answer:
""")

# Step 6: Create RAG chain using modern LCEL
document_chain = create_stuff_documents_chain(llm, prompt)
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})
qa_chain = create_retrieval_chain(retriever, document_chain)

# Step 7: Test the RAG system
if __name__ == "__main__":
    questions = [
        "What is LangChain?",
        "What are vector stores?",
        "How does RAG work?"
    ]
    
    for question in questions:
        print(f"\n--- Question: {question} ---")
        result = qa_chain.invoke({"input": question})
        print(f"Answer: {result['answer']}")
        print(f"\nSources ({len(result['context'])}):")
        for i, doc in enumerate(result['context'], 1):
            content = doc.page_content if hasattr(doc, 'page_content') else str(doc)
            print(f"  {i}. {content[:100]}...")
```

```bash
python3 rag_system.py
```

---

## 10. Real-World Project

### Project: Banking Regulation Q&A System 🏦

**Goal:** Build a complete RAG system for answering banking regulation questions.

**What it does:** This system can answer questions about banking regulations by searching through regulation documents.

**Simple explanation:**
- User asks: "What is CRR Article 92?"
- System searches regulation documents
- System finds relevant information
- System generates an answer based on the found information

```bash
cd ../08_real_world_project
touch banking_rag_system.py
```

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.chat_history import InMemoryChatMessageHistory

# Load environment variables
load_dotenv()

class BankingRAGSystem:
    def __init__(self):
        # Initialize components
        self.embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
        self.llm = ChatOpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            model="gpt-4o",
            temperature=0.1
        )
        self.memory = InMemoryChatMessageHistory()
        self.vectorstore = None
        self.qa_chain = None
        
    def load_documents(self, documents):
        """Load and process documents"""
        print("📄 Loading documents...")
        
        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100
        )
        
        chunks = text_splitter.create_documents(documents)
        print(f"   Split into {len(chunks)} chunks")
        
        # Create vector store
        self.vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings
        )
        print("   Created vector store")
        
    def create_qa_chain(self):
        """Create the Q&A chain with memory"""
        print("🔗 Creating Q&A chain...")
        
        # Custom prompt for banking regulations
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a banking regulation expert. Answer questions about banking regulations
            based on the provided context. If the answer is not in the context, say so."""),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", """Previous conversation:
            {chat_history}
            
            Context from regulations:
            {context}
            
            Question: {input}
            
            Answer:""")
        ])
        
        # Create document chain
        document_chain = create_stuff_documents_chain(self.llm, prompt)
        
        # Create retrieval chain
        retriever = self.vectorstore.as_retriever(search_kwargs={"k": 3})
        self.qa_chain = create_retrieval_chain(retriever, document_chain)
        print("   Q&A chain created")
        
    def ask(self, question):
        """Ask a question to the system"""
        if not self.qa_chain:
            return "System not initialized. Please load documents first."
        
        # Get chat history
        chat_history = self.memory.messages
        
        # Invoke chain
        result = self.qa_chain.invoke({
            "input": question,
            "chat_history": chat_history
        })
        
        # Update memory
        self.memory.add_user_message(question)
        self.memory.add_ai_message(result["answer"])
        
        return result["answer"]
    
    def chat(self):
        """Interactive chat interface"""
        print("\n🏦 Banking Regulation Q&A System")
        print("=" * 50)
        print("Type 'exit' to end the conversation\n")
        
        while True:
            question = input("You: ")
            
            if question.lower() == 'exit':
                print("Goodbye!")
                break
            
            answer = self.ask(question)
            print(f"AI: {answer}\n")

# Sample banking regulation documents
banking_regulations = [
    """
    CRR Article 92 - Capital Requirements
    Banks must maintain a minimum capital ratio of 8% of risk-weighted assets.
    This includes Tier 1 capital of at least 6% and Tier 2 capital.
    The capital adequacy ratio is calculated quarterly and reported to regulators.
    """,
    """
    PRA Regulations - Prudential Regulation Authority
    The PRA is responsible for the prudential regulation of banks, building societies,
    credit unions, insurers, and major investment firms. It sets standards for capital,
    liquidity, and risk management to ensure financial stability.
    """,
    """
    Basel III Framework
    Basel III is an international regulatory framework that strengthens bank capital
    requirements and introduces new regulatory requirements on bank liquidity and leverage.
    It was developed in response to the financial crisis of 2007-2008.
    """
]

if __name__ == "__main__":
    # Create system
    system = BankingRAGSystem()
    
    # Load documents
    system.load_documents(banking_regulations)
    
    # Create Q&A chain
    system.create_qa_chain()
    
    # Start interactive chat
    system.chat()
```

```bash
python3 banking_rag_system.py
```

---

## 11. Advanced Topics

### Streaming Responses

```bash
cd ../..
touch demos/09_advanced/streaming_demo.py
```

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.callbacks import StreamingStdOutCallbackHandler

# Load environment variables
load_dotenv()

# Initialize streaming LLM
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o",
    streaming=True,
    callbacks=[StreamingStdOutCallbackHandler()],
    temperature=0.7
)

print("🌊 Streaming Response Demo")
print("=" * 50)
print("\nQuestion: Explain machine learning in detail\n")
print("Answer (streaming): ")

response = llm.invoke("Explain machine learning in detail")
print("\n\n✅ Streaming complete!")
```

---

### Custom Tools and Agents

```bash
touch demos/09_advanced/custom_tools.py
```

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import Tool, StructuredTool
from langchain.agents import create_openai_tools_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from pydantic import BaseModel, Field

# Load environment variables
load_dotenv()

# Define input schema for structured tool
class CalculatorInput(BaseModel):
    expression: str = Field(description="Mathematical expression to evaluate")

# Custom tool with structured input
def calculate(expression: str) -> str:
    """Perform mathematical calculations"""
    try:
        result = eval(expression)
        return f"Result: {result}"
    except Exception as e:
        return f"Error: {str(e)}"

# Create structured tool
calculator_tool = StructuredTool.from_function(
    func=calculate,
    name="Calculator",
    description="Perform mathematical calculations",
    args_schema=CalculatorInput
)

# Initialize LLM
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o",
    temperature=0.1
)

# Create prompt for agent
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant with access to tools."),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

# Create agent with custom tool
agent = create_openai_tools_agent(llm, [calculator_tool], prompt)
agent_executor = AgentExecutor(agent=agent, tools=[calculator_tool], verbose=True)

# Test
if __name__ == "__main__":
    print("🔧 Custom Tools Demo")
    print("=" * 50)
    
    query = "What is 15 * 23 + 100?"
    response = agent_executor.invoke({"input": query})
    print(f"\nFinal Answer: {response['output']}")
```

---

### Error Handling & Retries

```bash
touch demos/09_advanced/error_handling.py
```

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.callbacks import BaseCallbackHandler
from tenacity import retry, stop_after_attempt, wait_exponential
import time

# Load environment variables
load_dotenv()

class ErrorHandler(BaseCallbackHandler):
    def on_llm_error(self, error, **kwargs):
        print(f"❌ LLM Error: {error}")
        return "I apologize, but I encountered an error. Please try again."

# Initialize LLM with error handling
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o",
    temperature=0.1,
    callbacks=[ErrorHandler()]
)

# Retry decorator
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=10))
def robust_query(prompt):
    """Query with retry logic"""
    try:
        response = llm.invoke(prompt)
        return response.content if hasattr(response, 'content') else str(response)
    except Exception as e:
        print(f"Error occurred: {e}")
        raise

# Test
if __name__ == "__main__":
    print("🛡️ Error Handling Demo")
    print("=" * 50)
    
    try:
        response = robust_query("What is Python?")
        print(f"Response: {response}")
    except Exception as e:
        print(f"Failed after retries: {e}")
```

---

## Practice Exercises 🏋️

### Exercise 1: Build a Simple Chatbot
Create a chatbot that:
- Remembers conversation history
- Can answer questions about a specific topic
- Has a friendly personality

### Exercise 2: Create a Document Q&A System
Build a system that:
- Loads documents from a folder
- Creates embeddings and vector store
- Answers questions based on the documents

### Exercise 3: Build an Agent with Multiple Tools
Create an agent that can:
- Search the web
- Perform calculations
- Get current date/time
- Answer questions using these tools

### Exercise 4: Implement RAG for Your Domain
Build a RAG system for:
- Your specific domain (banking, healthcare, etc.)
- Multiple document types
- Conversation memory
- Source citation

---

## Best Practices ✅

1. **Prompt Engineering**
   - Be specific and clear
   - Provide examples when needed
   - Use role-based prompts
   - Test and iterate

2. **Memory Management**
   - Choose appropriate memory type
   - Monitor token usage
   - Summarize long conversations
   - Clean up when needed

3. **Error Handling**
   - Always handle exceptions
   - Implement retry logic
   - Provide user-friendly error messages
   - Log errors for debugging

4. **Performance Optimization**
   - Use streaming for better UX
   - Cache frequent queries
   - Optimize chunk sizes
   - Use appropriate models

5. **Security**
   - Never expose API keys
   - Validate user inputs
   - Sanitize outputs
   - Implement rate limiting

---

## Common Issues & Solutions 🔧

### Issue 1: API Rate Limits
**Solution:** Implement rate limiting and retry logic with exponential backoff

### Issue 2: Token Limits
**Solution:** Use appropriate memory types, summarize conversations, split documents properly

### Issue 3: Slow Responses
**Solution:** Use streaming, optimize prompts, cache results, use faster models

### Issue 4: Poor Quality Answers
**Solution:** Improve prompts, provide better context, use RAG for factual information

---

## Next Steps 🚀

1. **Explore Advanced Features**
   - Multi-modal capabilities
   - Function calling
   - Custom chains
   - Advanced agents

2. **Build Real Projects**
   - Document Q&A systems
   - Chatbots for specific domains
   - AI assistants with tools
   - RAG applications

3. **Learn Related Technologies**
   - LangGraph for complex workflows
   - Vector databases (Pinecone, Weaviate)
   - Model fine-tuning
   - Production deployment

---

## Resources 📚

- **Official Documentation:** https://python.langchain.com/
- **GitHub:** https://github.com/langchain-ai/langchain
- **Community:** https://github.com/langchain-ai/langchain/discussions
- **Tutorials:** https://python.langchain.com/docs/get_started/introduction

---

**Happy Learning! 🎉**

