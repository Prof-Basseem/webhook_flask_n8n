# Flask n8n Webhook Integration

A modern Flask web application for sending data to n8n workflows via webhooks.

## 🚀 Features

- **Modern UI**: Beautiful, responsive interface with glassmorphism design
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Visual feedback during form submission
- **Environment Configuration**: Secure configuration using environment variables
- **Webhook Testing**: Built-in API endpoint for testing webhook connectivity
- **Mobile Responsive**: Works perfectly on all devices

## 📋 Prerequisites

- Python 3.7+
- n8n workflow with webhook trigger
- Internet connection for webhook requests

## 🔧 Installation & Setup

### 1. Clone or Download the Project
```bash
cd webhook_flask_n8n
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
FLASK_SECRET_KEY=your-secret-key-here
FLASK_DEBUG=True
```

### 4. Run the Application
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 🔗 n8n Webhook Setup

### 1. Create a New Workflow in n8n
1. Add a **Webhook** node as the trigger
2. Set the HTTP Method to `POST`
3. Copy the webhook URL
4. Update your `.env` file with the webhook URL

### 2. Expected Payload Format
The Flask app sends the following JSON payload:

```json
{
    "name": "User Name",
    "message": "User message content",
    "timestamp": "2025-07-03T12:00:00Z",
    "source": "flask-webapp"
}
```

### 3. Sample n8n Response
Your n8n workflow can return a JSON response:

```json
{
    "reply": "Message received successfully!",
    "status": "processed",
    "workflow_id": "your-workflow-id"
}
```

## 🧪 Testing

### Test Webhook Connectivity
```bash
python test_webhook.py
```

### Test via Web Interface
1. Open `http://localhost:5000`
2. Fill in the form with test data
3. Submit and check the response

### Test API Endpoint
```bash
curl -X POST http://localhost:5000/api/test-webhook
```

## 📁 Project Structure

```
webhook_flask_n8n/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── .env                       # Environment variables (create this)
├── test_webhook.py            # Webhook testing script
├── templates/
│   ├── base.html              # Base template with navbar & footer
│   └── index.html             # Main form page
└── static/
    ├── css/
    │   ├── main.css           # Main styles with validation
    │   └── inc/
    │       ├── navbar.css     # Navigation styles
    │       └── footer.css     # Footer styles
    └── js/
        ├── script.js          # Form handling & validation
        └── inc/
            ├── navbar.js      # Navigation functionality
            └── footer.js      # Footer interactions
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `N8N_WEBHOOK_URL` | Your n8n webhook URL | Required |
| `FLASK_SECRET_KEY` | Flask session secret key | `159753AA` |
| `FLASK_DEBUG` | Enable debug mode | `True` |

### Form Validation Rules

- **Name**: Required, minimum 2 characters
- **Message**: Required, minimum 10 characters

## 🎨 Customization

### Styling
- Modify `static/css/main.css` for general styles
- Update `static/css/inc/navbar.css` for navigation styles
- Edit `static/css/inc/footer.css` for footer styles

### JavaScript
- `static/js/script.js` - Form handling and validation
- `static/js/inc/navbar.js` - Navigation functionality
- `static/js/inc/footer.js` - Footer interactions

### Templates
- `templates/base.html` - Base layout
- `templates/index.html` - Main form page

## 🛡️ Security Features

- Environment-based configuration
- Input validation and sanitization
- CSRF protection ready (can be easily added)
- Timeout protection for webhook requests
- Error message sanitization

## 🐛 Troubleshooting

### Common Issues

1. **Webhook URL not reachable**
   - Verify the n8n webhook URL is correct
   - Check if n8n instance is running
   - Test with `python test_webhook.py`

2. **Form validation errors**
   - Check browser console for JavaScript errors
   - Verify form field names match backend expectations

3. **Environment variables not loading**
   - Ensure `.env` file exists in the project root
   - Check variable names are correct
   - Verify python-dotenv is installed

### Debug Mode
Enable debug mode in `.env`:
```env
FLASK_DEBUG=True
```

## 📊 API Endpoints

### POST `/`
Main form submission endpoint
- **Method**: POST
- **Content-Type**: application/x-www-form-urlencoded
- **Body**: `name`, `message`, `timestamp`

### POST `/api/test-webhook`
Test webhook connectivity
- **Method**: POST
- **Response**: JSON with test results

## 🔄 Development Workflow

1. Make changes to code
2. Test with `python test_webhook.py`
3. Test via web interface
4. Check browser console for JavaScript errors
5. Monitor Flask console for backend errors

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the logs for error messages
3. Test webhook connectivity
4. Verify n8n workflow configuration
