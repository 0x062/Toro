from stem import Signal
from stem.control import Controller
import time

with Controller.from_port(port=9051) as controller:
    controller.authenticate()
    while True:
        print("Rotating IP...")
        controller.signal(Signal.NEWNYM)
        time.sleep(60)  # Rotasi tiap 1 menit
