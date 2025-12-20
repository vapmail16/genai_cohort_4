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