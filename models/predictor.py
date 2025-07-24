import os
import pickle
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE_DIR, 'best_model.pkl'), 'rb') as f:
    model = pickle.load(f)

with open(os.path.join(BASE_DIR, 'scaler.pkl'), 'rb') as f:
    scaler = pickle.load(f)

def predict_productivity(data_dict):
    features = [
        float(data_dict.get('coffee_intake', 0)),
        float(data_dict.get('hours_of_meetings', 0)),
        float(data_dict.get('bugs_assigned', 0)),
        float(data_dict.get('lines_of_code_written', 0)),
        float(data_dict.get('hours_of_sleep', 0)),
        float(data_dict.get('browsing_time', 0)),
    ]
    features = np.array(features).reshape(1, -1)
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]
    return prediction
