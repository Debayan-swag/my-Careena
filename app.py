from flask import Flask, request, jsonify,render_template
from flask_cors import CORS
import google.generativeai as genai
import re
import os
app = Flask(__name__)
CORS(app)

genai.configure(api_key="AIzaSyDsv7a7iCNOruho0qWQ9nfqRGc6HdOzwp0")

# Store conversations in memory
conversations = {}

def detect_genz_style(message):
    genz_patterns = {
        'slang': r'\b(ngl|fr|tbh|lowkey|highkey|bet|cap|no cap|bussin|vibing|fam|bruh|sus|tea|slay)\b',
        'abbreviations': r'\b(idk|imo|irl|nvm|omg|tbf|tysm|ong)\b',
        'emphasis': r'(!!+|\?\?+|periodt|purr|sksksk)',
    }
    
    for pattern in genz_patterns.values():
        if re.search(pattern, message.lower()):
            return True
    return False

def get_personality_based_prompt(message):
    is_genz = detect_genz_style(message)
    
    base_prompt = """You are CAREENA, a specialized medical AI assistant who adapts to users' communication styles."""
    
    if is_genz:
        prompt_style = """
Respond in a Gen-Z friendly way using:
- Casual, relatable language
- Appropriate emojis
- Short, punchy sentences
- "fr fr" for emphasis
- "no cap" for honesty
- Keep medical info accurate but make it digestible
"""
    else:
        prompt_style = """
Respond in a professional yet friendly way with:
- Clear, concise language
- Professional medical terminology when needed
- Empathetic tone
- Well-structured information
"""

    format_guide = """
For introduction/greeting, simply respond naturally without any disclaimers.

For medical queries, format as:
💫 Quick Take:
[Simple explanation]

🔑 Main Tea:
• [Key point 1]
• [Key point 2]
• [Key point 3]

📝 The Details:
[Full explanation]

💭 Pro Tips:
[Advice and guidance]

Note: Add medical disclaimer ONLY for health-related questions.
"""

    return f"{base_prompt}\n{prompt_style}\n{format_guide}\n\nUser Query: {message}"






@app.route('/')
def home():
    return render_template('Ca.html')


@app.route('/chat-bot')
def chat_bot():
    return render_template('Ca2.html')


@app.route('/oOps')
def error_page():
    return render_template('CaError.html')


@app.route('/forgot?')
def forgot_pass():
    return render_template('forgotPass.html')


@app.route('/catchUP')
def login_page():
    return render_template('login.html')


@app.route('/oh-noo')
def login_error():
    return render_template('loginError.html')


@app.route('/onetime')
def otp_page():
    return render_template('otp.html')


@app.route('/book-it')
def signup_page():
    return render_template('signUP.html')







@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    session_id = data.get('sessionId', '')

    if session_id not in conversations:
        conversations[session_id] = []

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")

        # Add conversation history to prompt
        history = "\n".join([
            f"{'User' if msg['role'] == 'user' else 'Assistant'}: {msg['content']}"
            for msg in conversations[session_id][-5:]  # Last 5 messages
        ])

        prompt = get_personality_based_prompt(user_message)
        if history:
            prompt += f"\n\nPrevious conversation:\n{history}"
        response = model.generate_content(prompt)
        bot_reply = response.text if response else "Oops, my brain froze! Can you try again? 🤔"

        # Store messages in conversation history
        conversations[session_id].append({"role": "user", "content": user_message})
        conversations[session_id].append({"role": "assistant", "content": bot_reply})

        # No disclaimers, direct medical advice
        bot_reply = bot_reply.replace("⚠️ Medical Disclaimer:", "").replace("⚠️ Friendly reminder:", "")
        
        return jsonify({"reply": bot_reply})
    
    except Exception as e:
        return jsonify({"reply": "Error: " + str(e)})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5501))
    app.run(debug=True, host='0.0.0.0', port=port)