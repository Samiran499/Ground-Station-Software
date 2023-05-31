import serial
import json

with open('C:/rtgs/pyro.txt','w') as f1:
    f1.seek(0)
    f1.write("0")

with open("C:/rtgs/conf.json",'r') as file:
    com = json.load(file)
    keys = com['dataPoints']
    values = [value['value'] for value in keys.values()]
with open('C:/rtgs/data.json','w') as f4:
    initial = {value['value'] : 0 for value in keys.values()}
    json.dump(initial,f4)
ser = serial.Serial("COM"+com["comPort"], 115200)  # Replace 'COM3' with the correct COM port assigned to your Pico
ser.flushInput()  # Flush the input buffer

# # Read and print console output
while True:
    if ser.in_waiting > 0:
        jdata = ser.readline().decode('utf-8').rstrip()
        print(jdata)
        data = eval(jdata)
        if isinstance(data, tuple):
            fdata = {key: value for key, value in zip(values, data)}
            # print(fdata)
            with open('C:/rtgs/data.json','w') as f,open('C:/rtgs/pyro.txt','r+') as f2:
                json.dump(fdata,f)
                num = f2.readline()
                print(num,"num")
                if(num == '1'):
                    print("hehe")
                    ser.write(b'1\r\n')
                    f2.seek(0)
                    f2.write("0")
            # # print(fdata)
