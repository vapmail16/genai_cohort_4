import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Page configuration
st.set_page_config(
    page_title="Neural Network: Next Word Prediction",
    page_icon="🧠",
    layout="wide"
)

# Initialize session state for navigation
if 'current_slide' not in st.session_state:
    st.session_state.current_slide = 0

# Total number of slides
total_slides = 8

def next_slide():
    if st.session_state.current_slide < total_slides - 1:
        st.session_state.current_slide += 1

def prev_slide():
    if st.session_state.current_slide > 0:
        st.session_state.current_slide -= 1

# Navigation buttons
col1, col2, col3 = st.columns([1, 1, 1])
with col1:
    if st.button("◀ Previous", disabled=(st.session_state.current_slide == 0)):
        prev_slide()
with col2:
    st.write(f"**Slide {st.session_state.current_slide + 1} of {total_slides}**")
with col3:
    if st.button("Next ▶", disabled=(st.session_state.current_slide == total_slides - 1)):
        next_slide()

st.markdown("---")

# Slide content
current = st.session_state.current_slide

if current == 0:
    # Slide 1: Introduction
    st.title("🧠 Neural Network: Next Word Prediction")
    st.markdown("### Understanding How AI Predicts the Next Word")
    
    st.markdown("""
    **Our Example Sentence:**
    ```
    "a cat sat on a"
    ```
    
    **Question:** What word comes next?
    
    In this presentation, we'll explore how a neural network learns to predict
    the next word in a sequence. We'll use a simple example to understand the
    concepts at a high level.
    """)
    
    st.info("👆 Click **Next ▶** to begin the journey!")

elif current == 1:
    # Slide 2: The Problem
    st.title("📝 The Problem: Sequence Prediction")
    
    st.markdown("""
    ### What We're Trying to Do
    
    Given a sequence of words:
    ```
    "a" → "cat" → "sat" → "on" → "a" → ?
    ```
    
    We want the neural network to predict what word should come next.
    
    **Possible next words might be:**
    - "mat" (most likely)
    - "table"
    - "chair"
    - "bed"
    """)
    
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("""
        **Why is this hard?**
        - Language has many patterns
        - Context matters
        - Same word can have different meanings
        """)
    with col2:
        st.markdown("""
        **How neural networks help:**
        - Learn patterns from data
        - Understand context
        - Make probabilistic predictions
        """)

elif current == 2:
    # Slide 3: Word Embeddings
    st.title("🔢 Step 1: Converting Words to Numbers")
    
    st.markdown("""
    ### Neural networks work with numbers, not words!
    
    First, we need to convert words into numerical representations called **embeddings**.
    """)
    
    # Example embeddings
    words = ["a", "cat", "sat", "on", "mat", "table"]
    embeddings = {
        "a": [0.1, 0.2, 0.3],
        "cat": [0.8, 0.1, 0.2],
        "sat": [0.2, 0.9, 0.1],
        "on": [0.3, 0.2, 0.8],
        "mat": [0.7, 0.6, 0.4],
        "table": [0.5, 0.5, 0.7]
    }
    
    st.markdown("#### Example Word Embeddings (3-dimensional):")
    
    col1, col2, col3 = st.columns(3)
    for i, word in enumerate(["a", "cat", "sat"]):
        with [col1, col2, col3][i]:
            st.code(f"{word}: {embeddings[word]}")
    
    st.markdown("""
    **Key Insight:** 
    - Each word becomes a vector of numbers
    - Similar words have similar vectors
    - The network learns these representations
    """)

elif current == 3:
    # Slide 4: Neural Network Architecture
    st.title("🏗️ Step 2: The Neural Network Structure")
    
    st.markdown("""
    ### How the Network is Organized
    
    A neural network has layers that process information:
    """)
    
    # Visual representation
    st.markdown("""
    ```
    Input Layer (Words) 
         ↓
    Hidden Layer 1 (Processes patterns)
         ↓
    Hidden Layer 2 (Understands context)
         ↓
    Output Layer (Predicts next word)
    ```
    """)
    
    st.markdown("---")
    
    # What are Weights section
    st.markdown("### 🔑 What Are Weights?")
    
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("""
        **Think of weights like:**
        - **Volume knobs** on a mixing board
        - **Importance scores** for each connection
        - **Tuning parameters** that get adjusted during training
        
        **Example:**
        - Connection from "cat" to "sat": weight = 0.9 (strong connection)
        - Connection from "cat" to "dog": weight = 0.1 (weak connection)
        """)
    with col2:
        st.markdown("""
        **In Real Life:**
        - Like adjusting the strength of relationships
        - Higher weight = more influence
        - Lower weight = less influence
        - Network learns optimal weights from data
        
        **During Training:**
        - Starts with random weights
        - Adjusts them based on errors
        - Eventually finds the best values
        """)
    
    st.markdown("---")
    
    # What happens in Hidden Layers
    st.markdown("### 🧠 What Happens in Hidden Layers?")
    
    st.markdown("""
    **Hidden Layer 1: Pattern Recognition**
    """)
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown("""
        **Detects:**
        - Word pairs
        - "cat" + "sat"
        - "sat" + "on"
        - Basic grammar patterns
        """)
    with col2:
        st.markdown("""
        **Process:**
        - Takes input numbers
        - Multiplies by weights
        - Adds them together
        - Applies activation function
        """)
    with col3:
        st.markdown("""
        **Output:**
        - Transformed numbers
        - Representing detected patterns
        - Passed to next layer
        """)
    
    st.markdown("""
    **Hidden Layer 2: Context Understanding**
    """)
    
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("""
        **Builds on Layer 1:**
        - Combines patterns from Layer 1
        - Recognizes longer sequences
        - Understands "a cat sat on a" as a phrase
        - Considers full context, not just last word
        """)
    with col2:
        st.markdown("""
        **Real-Life Analogy:**
        - Like reading a sentence and understanding meaning
        - Not just individual words, but the whole picture
        - "The cat sat on..." → expects a surface word
        - Context helps narrow down possibilities
        """)
    
    st.markdown("---")
    
    # How it works in real life
    st.markdown("### 🌍 How It Works in Real Life")
    
    st.markdown("""
    **Example: Processing "a cat sat on a"**
    """)
    
    steps = [
        ("1️⃣ Input", "Words converted to numbers: [0.1, 0.8, 0.2, 0.3, 0.1]"),
        ("2️⃣ Hidden Layer 1", "Detects: 'cat-sat' pattern (weight: 0.9), 'sat-on' pattern (weight: 0.85)"),
        ("3️⃣ Hidden Layer 2", "Recognizes: 'a cat sat on a' is a complete phrase expecting a noun"),
        ("4️⃣ Output Layer", "Calculates probabilities: mat (75%), table (12%), chair (5%)...")
    ]
    
    for step_name, description in steps:
        with st.expander(f"{step_name}", expanded=True):
            st.write(description)
    
    st.markdown("---")
    
    # Real-world analogy
    st.markdown("### 💡 Real-World Analogy")
    
    st.markdown("""
    **Think of it like a factory assembly line:**
    """)
    
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("""
        **Assembly Line:**
        1. **Station 1 (Input):** Raw materials arrive
        2. **Station 2 (Hidden 1):** Basic components assembled
        3. **Station 3 (Hidden 2):** Complex parts combined
        4. **Station 4 (Output):** Final product ready
        
        **Each station:**
        - Has workers (neurons)
        - Uses tools (weights)
        - Transforms materials (data)
        - Passes to next station
        """)
    with col2:
        st.markdown("""
        **Neural Network:**
        1. **Input Layer:** Words arrive as numbers
        2. **Hidden Layer 1:** Basic patterns detected
        3. **Hidden Layer 2:** Context understood
        4. **Output Layer:** Prediction made
        
        **Each layer:**
        - Has neurons (processing units)
        - Uses weights (connection strengths)
        - Transforms information
        - Passes to next layer
        """)
    
    st.info("""
    💡 **Key Insight:** The network doesn't "know" what words mean. It learns statistical 
    patterns - like noticing that "mat" appears 75% of the time after "a cat sat on a" 
    in the training data. That's why it predicts "mat" with high confidence!
    """)

elif current == 4:
    # Slide 5: How It Learns Patterns
    st.title("🎓 Step 3: Learning Patterns")
    
    st.markdown("""
    ### The Network Learns from Examples
    
    During training, the network sees millions of sentences:
    """)
    
    examples = [
        "a cat sat on a mat",
        "a dog sat on a mat",
        "a cat sat on a table",
        "the cat sat on the mat"
    ]
    
    st.markdown("#### Training Examples:")
    for i, example in enumerate(examples, 1):
        st.write(f"{i}. \"{example}\"")
    
    st.markdown("""
    **What the network learns:**
    1. "cat" often comes after "a"
    2. "sat" often follows "cat"
    3. "on" often comes after "sat"
    4. "a" often follows "on"
    5. "mat" is very common after "a cat sat on a"
    """)
    
    st.success("""
    💡 **Key Concept:** The network adjusts its internal parameters (weights) 
    to minimize prediction errors. Over time, it gets better at recognizing patterns!
    """)

elif current == 5:
    # Slide 6: Processing Our Example
    st.title("⚙️ Step 4: Processing Our Sentence")
    
    st.markdown("""
    ### Let's Trace Through: "a cat sat on a"
    """)
    
    # Step-by-step visualization
    steps = [
        ("Step 1", "Input: 'a'", "Network receives embedding for 'a'"),
        ("Step 2", "Input: 'cat'", "Network sees 'a cat' pattern"),
        ("Step 3", "Input: 'sat'", "Network recognizes 'cat sat' pattern"),
        ("Step 4", "Input: 'on'", "Network sees 'sat on' pattern"),
        ("Step 5", "Input: 'a'", "Network recognizes 'on a' pattern"),
        ("Step 6", "Predict", "Network uses all context to predict next word")
    ]
    
    for step_num, action, description in steps:
        with st.expander(f"{step_num}: {action}", expanded=(step_num == "Step 6")):
            st.write(description)
    
    st.markdown("""
    **At each step:**
    - The network processes the current word
    - It remembers previous words (context)
    - It builds up understanding of the sentence
    - Finally, it predicts the most likely next word
    """)

elif current == 6:
    # Slide 7: The Prediction
    st.title("🎯 Step 5: Making the Prediction")
    
    st.markdown("""
    ### The Network's Decision
    
    After processing "a cat sat on a", the network calculates probabilities:
    """)
    
    # Create a bar chart
    predictions = {
        "mat": 0.75,
        "table": 0.12,
        "chair": 0.05,
        "bed": 0.04,
        "floor": 0.03,
        "sofa": 0.01
    }
    
    fig = go.Figure(data=[
        go.Bar(
            x=list(predictions.keys()),
            y=list(predictions.values()),
            marker_color=['#667eea' if word == 'mat' else '#94a3b8' for word in predictions.keys()],
            text=[f"{v*100:.1f}%" for v in predictions.values()],
            textposition='auto'
        )
    ])
    
    fig.update_layout(
        title="Prediction Probabilities",
        xaxis_title="Possible Next Words",
        yaxis_title="Probability",
        height=400,
        showlegend=False
    )
    
    st.plotly_chart(fig, width='stretch')
    
    st.success("""
    🎉 **Result:** The network predicts **"mat"** with 75% confidence!
    
    This makes sense because "a cat sat on a mat" is a very common phrase
    in the training data.
    """)

elif current == 7:
    # Slide 8: Key Takeaways
    st.title("📚 Key Takeaways")
    
    st.markdown("""
    ### What We Learned
    """)
    
    takeaways = [
        ("1️⃣ **Words → Numbers**", 
         "Neural networks convert words into numerical embeddings that capture meaning"),
        
        ("2️⃣ **Layered Processing**", 
         "Information flows through layers, each extracting different patterns"),
        
        ("3️⃣ **Learning from Data**", 
         "The network learns by seeing many examples and adjusting its parameters"),
        
        ("4️⃣ **Context Matters**", 
         "The network uses the entire sequence, not just the last word, to make predictions"),
        
        ("5️⃣ **Probabilistic Output**", 
         "The network outputs probabilities, not certainties - it gives the most likely answer"),
    ]
    
    for title, description in takeaways:
        st.markdown(f"### {title}")
        st.write(description)
        st.markdown("")
    
    st.markdown("---")
    st.markdown("""
    ### 🚀 Real-World Applications
    
    This same concept powers:
    - **ChatGPT** and other language models
    - **Google Translate**
    - **Autocomplete** features
    - **Voice assistants** like Siri and Alexa
    
    All of these use neural networks to predict what comes next in a sequence!
    """)
    
    st.info("""
    💡 **Remember:** This is a simplified explanation. Real neural networks 
    are much more complex, but the core concepts remain the same!
    """)

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #666;'>
    Neural Network: Next Word Prediction Demo | Created with Streamlit
</div>
""", unsafe_allow_html=True)

