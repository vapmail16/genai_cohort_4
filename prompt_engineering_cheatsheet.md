# Prompt Engineering Cheat Sheet
## Quick Reference Guide

---

## 🎯 The 4 Pillars

**1. CLARITY** - Be specific, remove ambiguity
**2. CONTEXT** - Provide background and relevant details  
**3. CONSTRAINTS** - Set format, length, style, boundaries
**4. EXAMPLES** - Show what good output looks like

---

## 📐 CRISPE Framework

**C** - **Capacity & Role**: Who is the AI?
- "You are an expert [role]..."
- "Act as a [profession]..."

**R** - **Request**: What do you want?
- Be specific and direct
- Clear action verb

**I** - **Insight**: Background and context
- Why you need this
- Who will use it
- Relevant information

**S** - **Style**: Tone, format, structure
- "Write in [style]..."
- "Use [format]..."
- "Structure as [layout]..."

**P** - **Personality**: Character traits
- "Be [trait]..."
- "Use [approach]..."

**E** - **Experiment**: Try variations
- Iterate and refine
- Test different approaches

---

## 🔧 Essential Prompt Patterns

### 1. Zero-Shot
Direct question, no examples
```
"What is machine learning?"
```

### 2. Few-Shot
Provide examples to establish pattern
```
Example 1: [input] → [output]
Example 2: [input] → [output]
Your task: [input] → ?
```

### 3. Chain-of-Thought
Request step-by-step reasoning
```
"Solve this step-by-step, showing your reasoning..."
"Think through this problem, explain each step..."
```

### 4. Role-Playing
Assign a persona
```
"You are a [role]..."
"Act as [character]..."
```

### 5. Iterative Refinement
Build on previous responses
```
Step 1: Create outline
Step 2: Expand section 1
Step 3: Refine and polish
```

---

## ✅ Prompt Checklist

Before sending, ask:
- [ ] Is it clear what I want?
- [ ] Have I provided enough context?
- [ ] Have I specified the format/structure?
- [ ] Have I set constraints (length, style, etc.)?
- [ ] Have I defined the role/persona?
- [ ] Have I included examples if needed?
- [ ] Is it the right length (not too short/long)?
- [ ] Have I avoided common mistakes?

---

## ❌ Common Mistakes to Avoid

1. ❌ Too vague → ✅ Be specific
2. ❌ Too much info → ✅ Concise and relevant
3. ❌ Multiple tasks → ✅ One thing at a time
4. ❌ No format → ✅ Specify structure
5. ❌ No context → ✅ Provide background
6. ❌ Wrong tone → ✅ Match audience
7. ❌ No constraints → ✅ Set boundaries
8. ❌ Not iterating → ✅ Refine based on results
9. ❌ Unclear instructions → ✅ Explicit directions
10. ❌ Ignoring output quality → ✅ Review and improve

---

## 🎨 Templates by Use Case

### Code Generation
```
Write a [language] function that [functionality].
Requirements: [list]
Include: [features]
Handle: [edge cases]
Format: [structure]
```

### Summarization
```
Summarize [content] in [length] for [audience].
Focus on: [key points]
Format as: [structure]
Tone: [style]
```

### Problem Solving
```
Solve [problem] step-by-step.
Show: [reasoning/work]
Consider: [factors]
Provide: [multiple solutions/analysis]
Verify: [method]
```

### Creative Writing
```
Write a [genre] about [topic].
Style: [reference/description]
Tone: [mood]
Include: [elements]
Length: [constraint]
```

### Analysis
```
Analyze [data/subject] using [method].
Focus on: [aspects]
Provide: [insights/patterns]
Present as: [format]
For: [audience]
```

---

## 🚀 Advanced Techniques

### Prompt Chaining
Break complex tasks into steps:
1. Research → 2. Outline → 3. Write → 4. Edit → 5. Format

### Self-Consistency
Ask AI to verify its work:
- "Review your answer for errors"
- "Check if this meets all requirements"

### Prompt Decomposition
Break big prompt into smaller ones, combine results

### System vs. User Messages
- **System**: Sets role, context, behavior
- **User**: The actual request

### Temperature Guide
- **Low (0.1-0.3)**: Factual, consistent, deterministic
- **Medium (0.5-0.7)**: Balanced creativity and consistency
- **High (0.8-1.0)**: Creative, varied, exploratory

---

## 💡 Quick Wins

### Make It Better:

**Add Specificity:**
- "Write code" → "Write Python function for email validation"

**Add Context:**
- "Summarize this" → "Summarize for busy executives in 3 bullets"

**Add Format:**
- "Give me a list" → "Numbered list, each item with heading and 2-sentence description"

**Add Constraints:**
- "Write an essay" → "500-word essay, 3 paragraphs, formal tone"

**Add Examples:**
- "Translate" → Show 2 examples, then ask for translation

---

## 📊 Prompt Quality Score

Rate your prompt (1-5 on each):

- **Clarity** (Is it specific?): ___/5
- **Context** (Enough background?): ___/5
- **Constraints** (Format specified?): ___/5
- **Examples** (Patterns shown?): ___/5
- **Role** (Persona defined?): ___/5

**Total: ___/25**

Aim for 20+ for great prompts!

---

## 🎯 Remember

1. **Iterate** - First prompt is rarely perfect
2. **Context matters** - More relevant context = better output
3. **Clarity beats cleverness** - Clear and direct works best
4. **Examples are powerful** - Show, don't just tell
5. **Practice makes perfect** - Keep experimenting!

---

**Print this, keep it handy, refer to it often! 📋**

