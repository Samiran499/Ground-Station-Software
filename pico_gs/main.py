from time import sleep
import ustruct
import _thread
from machine import Pin
from sx1262 import SX1262

push_button = Pin(16, Pin.IN)

pdata = [(0,)]
data = [(10,10,10,10,10)]
a = 0
def main():
    def cb(events):
        if events & SX1262.RX_DONE:
            msg, err = sx.recv()
            error = SX1262.STATUS[err]
            if push_button.value() == 1 or a == 1:
                sx.send(b'pyro')
                pdata[0] = (1,)
            message = ustruct.unpack('7f',msg)
            data[0] = message[0:7]
            print(data[0]+pdata[0])

    sx = SX1262(spi_bus=1, clk=14, mosi=15, miso=12, cs=9, irq=2, rst=6, gpio=7)

    sx.begin(freq=923, bw=500.0, sf=8, cr=5, syncWord=0x12,
        power=22, currentLimit=60.0, preambleLength=8,
        implicit=False, implicitLen=0xFF,
        crcOn=True, txIq=False, rxIq=False,
        tcxoVoltage=1.7, useRegulatorLDO=False, blocking=True)

    sx.setBlockingCallback(False, cb)

def pyro():
    for i in range(20):
        a = int(input())
        sleep(1)

_thread.start_new_thread(pyro , ())
main()



