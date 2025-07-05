from flask import Flask, render_template, request, redirect, flash, jsonify
import requests
import os
import logging
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', '159753AA')

# Configure logging - disable werkzeug logging
logging.basicConfig(level=logging.INFO)
app.logger.setLevel(logging.INFO)

# Disable werkzeug logging to prevent HTTP request logs
werkzeug_logger = logging.getLogger('werkzeug')
werkzeug_logger.setLevel(logging.ERROR)

# In-memory storage for received data from n8n
received_data = []

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


@app.route('/receive-from-n8n', methods=['POST'])
def receive_from_n8n():
    """
    Endpoint to receive JSON data from n8n webhook
    """
    try:
        # Get JSON data from the request
        data = request.get_json()
        
        if data is None:
            return jsonify({'status': 'error', 'message': 'No JSON data received'}), 400
        
        # Add timestamp and store in memory
        received_entry = {
            'data': data,
            'received_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'source_ip': request.remote_addr,
            'user_agent': request.headers.get('User-Agent', 'Unknown')
        }
        
        # Add to the beginning of the list (latest first)
        received_data.insert(0, received_entry)
        
        # Keep only the latest 100 entries to prevent memory issues
        if len(received_data) > 100:
            received_data.pop()
        
        return jsonify({
            'status': 'success', 
            'message': 'Data received successfully',
            'received_at': received_entry['received_at'],
            'total_entries': len(received_data)
        }), 200
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/view-data')
def view_data():
    """
    Display all received data from n8n
    """
    return render_template('view_data.html', received_data=received_data, total_count=len(received_data))


@app.route('/api/data')
def api_data():
    """
    API endpoint to get received data as JSON
    """
    return jsonify({
        'total_count': len(received_data),
        'data': received_data
    })


@app.route('/clear-data', methods=['POST'])
def clear_data():
    """
    Clear all received data from memory
    """
    global received_data
    try:
        data_count = len(received_data)
        received_data.clear()
        flash(f'✅ Successfully cleared {data_count} entries', 'success')
    except Exception as e:
        flash(f'❌ Error clearing data: {str(e)}', 'danger')
    
    return redirect('/view-data')


if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    app.run(host='0.0.0.0', port=5000)
