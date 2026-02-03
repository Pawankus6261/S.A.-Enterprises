import sys
import os

# Ye line aapke 'backend' folder ko Python path mein add karti hai
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# Ab hum aapke main app ko import kar sakte hain
from backend.main import app