import serial
import json

with open('C:/rtgs/pyro.txt','w') as f1:
    f1.seek(0)
    f1.write("0")

with open("C:/rtgs/conf.json",'r') as file:
    com = json.load(file)
    keys = com['AdataPoints']
    calibs = [(value['value'], value['calib']) for value in keys.values()]
with open('C:/rtgs/data.json','w') as f4:
    initial = {value['value'] : 0 for value in keys.values()}
    json.dump(initial,f4)
ser = serial.Serial("COM"+com["comPort"], 115200)  # Replace 'COM3' with the correct COM port assigned to your Pico
ser.flushInput()  # Flush the input buffer

# # Read and print console output
alt_mult = 1
acc_mult = 1
gyro_mult = 1
temp_mult = 1
temp_calib = 0

while True:
    if ser.in_waiting > 0:
        jdata = ser.readline().decode('utf-8').rstrip()
        if jdata[0] == "(":
            data = eval(jdata)
            if len(data) > 9:
                fdata = {'pyro': data[0],**{key[0]: (value /acc_mult if "acc" in key[0] else value/gyro_mult if "gyro" in key[0] else value/alt_mult if "alt" in key[0] else (value/temp_mult)+temp_calib if "temp" in key[0] else value) for key, value in zip(calibs, data[1:])}}
                print(fdata)
                with open('C:/rtgs/data.json','w') as f,open('C:/rtgs/pyro.txt','r+') as f2:
                    json.dump(fdata,f)
                    num = f2.readline()
                    print(num,"num")
                    if(num == '1'):
                        ser.write(b'1\r\n')
                        f2.seek(0)
                        f2.write("0")
                # # print(fdata)
            else :
                alt_mult = data[1]
                acc_mult = data[2]
                gyro_mult = data[3]
                temp_mult = data[4]
                temp_calib = data[5]
