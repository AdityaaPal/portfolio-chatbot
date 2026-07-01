from flask import Flask, render_template, request, jsonify
from rag.retriever import retrieve
from groq import Groq
import os

app = Flask(__name__)

# ✅ Groq client — fast cloud inference, free tier
client = Groq(
    api_key="api_key"  # replace with your actual API key
)

CONTACT_KEYWORDS = ["contact", "linkedin", "email", "reach", "mail", "connect", "gmail"]
IDENTITY_KEYWORDS = ["who created you", "who made you", "what are you", "who are you", "who built you"]

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():

    user_question = request.json["message"]

    # ✅ contact intent — bypass model entirely
    if any(word in user_question.lower() for word in CONTACT_KEYWORDS):
        return jsonify({"answer": "You can reach Aditya through his contact details below.\n[CONTACT_CARD]"})

    # ✅ identity intent — bypass model entirely
    if any(phrase in user_question.lower() for phrase in IDENTITY_KEYWORDS):
        return jsonify({"answer": "I'm an AI assistant built to help you learn about Aditya Pal. Ask me anything about his skills, experience, or projects!"})

    context = retrieve(user_question)

    prompt = f"""
You are an AI assistant built to represent Aditya Pal — a Data Science and AI graduate based in Mumbai.
You are Aditya's assistant, NOT Aditya himself. Always refer to Aditya in third person (e.g. "Aditya is...", "He has worked on...", "His skills include..."). Never say "I am Aditya" or speak as if you are him.

Your job is to answer questions about Aditya using ONLY the context provided below.

Rules:
- If the answer is clearly present in the context, answer confidently and concisely.
- If the answer is partially present, answer what you can and be transparent about the gaps.
- If the answer is not in the context at all, say exactly: "I don't have that information about Aditya right now."
- Never fabricate skills, experience, projects, or opinions.
- Never reference the context directly (don't say "according to the context" or "the document says").
- Keep answers focused — avoid padding or filler sentences.
- If someone asks something off-topic (unrelated to Aditya), politely redirect: "I'm here specifically to answer questions about Aditya Pal."
- Your entire response must be 3 sentences maximum. No exceptions. Stop after the 3rd sentence.

Tone: Professional but conversational. Confident, not arrogant.

Context:
{context}

Question:
{user_question}

Answer:
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",  # ✅ fast, free, smart — much better than qwen2.5:1.5b
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=180,
    )

    answer = response.choices[0].message.content
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=False)