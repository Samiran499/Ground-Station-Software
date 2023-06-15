import serial
import json

with open('C:/rtgs/pyro.txt','w') as f1:
    f1.seek(0)
    f1.write("0")

with open("C:/rtgs/conf.json",'r') as file:
    com = json.load(file)
    Akeys = com['AdataPoints']
    Dkeys = com['DdataPoints']
    descent_cal = [(value['value'], value['calib']) for value in Dkeys.values()]
    ascent_cal = [(value['value'], value['calib']) for value in Akeys.values()]
with open('C:/rtgs/data.json','w') as f4:
    initial = {value['value'] : 0 for value in Akeys.values()}
    json.dump(initial,f4)
ser = serial.Serial("COM"+com["comPort"], 115200)  # Replace 'COM3' with the correct COM port assigned to your Pico
ser.flushInput()  # Flush the input buffer

# # Read and print console output
alt_mult = 1
acc_mult = 1
gyro_mult = 1
temp_mult = 1
temp_calib = 0

def get_data(argument):
    if argument > 2:
        return {'pyro': data[0],**{key[0]: (value /acc_mult if "acc" in key[0] else value/gyro_mult if "gyro" in key[0] else value/alt_mult if "alt" in key[0] else (value/temp_mult)+temp_calib if "temp" in key[0] else value) for key, value in zip(descent_cal, data[1:])}}
    else:
        return {'pyro': data[0],**{key[0]: (value /acc_mult if "acc" in key[0] else value/gyro_mult if "gyro" in key[0] else value/alt_mult if "alt" in key[0] else (value/temp_mult)+temp_calib if "temp" in key[0] else value) for key, value in zip(ascent_cal, data[1:])}}

while True:
    if ser.in_waiting > 0:
        jdata = ser.readline().decode('utf-8').rstrip()
        if jdata[0] == "(":
            data = eval(jdata)
            if len(data) > 9:
                fdata = get_data(data[1])
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
                with open('C:/rtgs/cdata.txt','w') as cal:
                    cdata = (alt_mult,acc_mult,gyro_mult,temp_mult,temp_calib)
                    cal.write(str(data))