from flask import Flask, request, render_template, jsonify
from models.predictor import predict_productivity

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        prediction = predict_productivity(data)
        return jsonify({
            'prediction': int(prediction),
            'prediction_text': 'Today is likely to be a productive day!' if prediction == 1 else 'Today is likely to be a Not Productive day!'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True)
