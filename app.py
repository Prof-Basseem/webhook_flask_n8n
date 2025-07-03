from flask import Flask, render_template, request, redirect, flash, jsonify
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', '159753AA')

# n8n Webhook URL from environment variables
N8N_WEBHOOK_URL = os.getenv('N8N_WEBHOOK_URL', 'https://stayed-talked-austin-sofa.trycloudflare.com/webhook-test/from-flask')
                   
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Get form data
        name = request.form.get('name', '').strip()
        message = request.form.get('message', '').strip()

        # Validate input
        if not name or not message:
            flash('❌ Please fill in all fields', 'danger')
            return redirect('/')

        # Prepare data for n8n
        payload = {
            'name': name,
            'message': message,
            'timestamp': request.form.get('timestamp', ''),
            'source': 'flask-webapp'
        }

        try:
            # Send POST request to n8n webhook
            response = requests.post(
                N8N_WEBHOOK_URL, 
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30  # Add timeout
            )

            if response.status_code == 200:
                # Handle successful response from n8n
                try:
                    n8n_response = response.json()
                    reply_message = n8n_response.get('reply', '✅ Message sent successfully to n8n workflow!')
                    flash(reply_message, 'success')
                except ValueError:
                    # If response is not JSON
                    flash('✅ Message sent successfully to n8n workflow!', 'success')
            else:
                flash(f'⚠️ Failed to send message. Status: {response.status_code}', 'danger')
                
        except requests.exceptions.Timeout:
            flash('❌ Request timeout. Please try again.', 'danger')
        except requests.exceptions.ConnectionError:
            flash('❌ Unable to connect to n8n webhook. Please check the URL.', 'danger')
        except Exception as e:
            flash(f'❌ Error occurred: {str(e)}', 'danger')

        return redirect('/')

    return render_template('index.html')


if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)
