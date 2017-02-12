var mongoose = require('mongoose');
var schema = require('./schema');
var cropUserManagement = require('../data_management/crop_user_management');
var sensorManagement = require('../data_management/sensor_management');
var thingSpeak = require('../data_management/thing_speak');
var commonVariables = require('./common_variables');

var SensorHistoryManagement = schema.SensorHistory;
var queryCropUserId = cropUserManagement.queryCropUserId;
var querySensorId = sensorManagement.querySensorId;
var cb;
var field1Queue = thingSpeak.field1Queue;
var field2Queue = thingSpeak.field2Queue;
var field3Queue = thingSpeak.field3Queue;
var topics = commonVariables.mqtt_topics;

exports.createSensorHistory = function(sensorType, sensorData, callback) {
    // console.log('createSensorHistory')
    // console.log(sensorType)
    // console.log(sensorData)
    cb = callback;
    var data = JSON.parse(sensorData);
    var sensorId = querySensorId(sensorType), cropUserId = queryCropUserId();

    if (null == sensorId) {
        cb('[createSensorHistory] sensorId undefined');
        return;
    }

    if (null == cropUserId) {
        cb('[createSensorHistory] cropUserId undefined');
        return;
    }

    var sensorHistoryManagement = createSensorHistoryManagement(sensorType, data, sensorId, cropUserId);
    
    if (null == sensorHistoryManagement) {
        return;
    }

    sensorHistoryManagement.save(function(err) {
        if (err) {
            cb(err);
        } 
    })
}

function createSensorHistoryManagement(sensorType, data, sensorId, cropUserId) {
    switch (sensorType) {
        case topics[0]:
            if (!data.t) {
                cb('[createSensorHistoryManagement] data.t does not exist');
                return null;
            }

            var field2 = 'field2=' + data.t;
            field2Queue.push(field2);
            return new SensorHistoryManagement({sensor_id:sensorId, crop_user_id:cropUserId, value:data.t});

        case topics[1]:
            if (!data.h) {
                cb('[createSensorHistoryManagement] data.h does not exist');
                return null;
            }

            var field1 = 'field1=' + data.h;
            field1Queue.push(field1);
            return new SensorHistoryManagement({sensor_id:sensorId, crop_user_id:cropUserId, value:data.h});

        case topics[2]:
            if (!data.s) {
                cb('[createSensorHistoryManagement] data.s does not exist');
                return null;
            }

            var field3 = 'field3=' + data.s;
            field3Queue.push(field3);
            return new SensorHistoryManagement({sensor_id:sensorId, crop_user_id:cropUserId, value:data.s});
        
        default:
            cb('[exports.createSensorHistoryManagement] ' + sensorType + ' undefined');
            return null;
    }
}

// Sensor History REST API

exports.all_sensor_history = function(req, res) {
  SensorHistoryManagement.find({}).sort('-creation_date').limit(10).exec(function(err, sensorHistory) {
    if (err)
      res.send(err);
    else
      res.json(sensorHistory);
  });
};



exports.read_sensor_history = function(req, res) {
  SensorHistoryManagement.findById(req.params.sensorId, function(err, sensorHistory) {
    if (sensorHistory == undefined || sensorHistory == null)
      res.status(404).json({message: 'WaterConsumptionHistory record Not found'});
    else if (err)
      res.send(err);
    else
      res.json(sensorHistory);
  });
};


