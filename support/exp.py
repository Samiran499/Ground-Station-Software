import json

with open("C:/rtgs/conf.json",'r') as file:
    com = json.load(file)
    keys = com['AdataPoints']
    calibs = [(value['value'], value['calib']) for value in keys.values()]

alt_mult = 1
acc_mult = 1
gyro_mult = 1
temp_mult = 1
temp_calib = 0
data = (1,2,3,4,5,6,7)
fdata = {'pyro': data[0],**{key[0]: (value /acc_mult if "acc" in key[0] else value/gyro_mult if "gyro" in key[0] else value/alt_mult if "alt" in key[0] else (value/temp_mult)+temp_calib if "temp" in key[0] else value) for key, value in zip(calibs, data[1:])}}

print(fdata)