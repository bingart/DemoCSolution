import getpass
import sys

import stem
import stem.connection

from stem.control import Controller

if __name__ == '__main__':
    
    try:
        controller = Controller.from_port(address='127.0.0.1', port=9351)
    except stem.SocketError as exc:
        print("Unable to connect to tor on port 9351: %s" % exc)
        sys.exit(1)

    try:
        controller.authenticate()
    except stem.connection.MissingPassword:
        pw = ''
# 
#     try:
#         controller.authenticate(password = pw)
#     except stem.connection.PasswordAuthFailed:
#         print("Unable to authenticate, password is incorrect")
#         sys.exit(1)
#     except stem.connection.AuthenticationFailure as exc:
#         print("Unable to authenticate: %s" % exc)
#         sys.exit(1)

    print("Tor is running version %s" % controller.get_version())
    print("Tor is running pid %s" % controller.get_pid())
    
    circuits = controller.get_circuits()
	print('circuits=')
	print(circuits)
    for c in circuits:
        print ('c: {0}'.format(c.id))

    streams = controller.get_streams()
    print('streams=')
    print(streams)
    for s in streams:
        print ('s=' + str(s))

    #controller.signal('HALT')
    #print("Tor is halt" )
    controller.close()
