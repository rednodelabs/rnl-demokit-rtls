#!/usr/bin/python

# If 1, fixed precomputed positions are used
precomputed_positions = 0
anchor_positions = [[-50,-50],[-40,-40],[-30,-30],[-20,-20],[-10,-10],[0,0],[10,10],[20,20],[30,30],[40,40],[50,50],[60,60]]
anchor_ids = [2,3,4,5,6,7,8,9,10,11,12,13]

# Average Length for anchors
average_len = 4095
distance_offset = 26
min_distance = 10

REDNODERANGING_DISTANCE_ERROR = -32768
REDNODERANGING_ROLE_ANCHOR = 1;
REDNODERANGING_ROLE_TAG = 2;
REDNODERANGING_ROLE_LOW_POWER_TAG = 3;

REDNODEBUS_EVENT_STATUS_TX_SUCCESS = 0
REDNODEBUS_EVENT_STATUS_RX_SUCCESS = 1
REDNODEBUS_EVENT_STATUS_RX_FAILED = 2
