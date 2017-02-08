'use strict';


var mongoose = require('mongoose'),
    schema = require('./schema'),
  Sensor = schema.Sensor;

exports.list_sensors = function(req, res) {
  Sensor.find({}, function(err, sensor) {
    if (err)
      res.send(err);
    res.json(sensor);
  });
};




exports.create_sensor = function(req, res) {
  var new_sensor = new Sensor(req.body);
  new_sensor.save(function(err, sensor) {
    if (err)
      res.send(err);
    res.json(sensor);
  });
};


exports.read_sensor = function(req, res) {
  Sensor.findById(req.params.sensorId, function(err, sensor) {
    if (err)
      res.send(err);
    res.json(sensor);
  });
};


exports.update_sensor = function(req, res) {
  Sensor.findOneAndUpdate(req.params.sensorId, req.body, {new: true}, function(err, sensor) {
    if (err)
      res.send(err);
    res.json(sensor);
  });
};


exports.delete_sensor = function(req, res) {


  Sensor.remove({
    _id: req.params.sensorId
  }, function(err, sensor) {
    if (err)
      res.send(err);
    res.json({ message: 'Sensor successfully deleted' });
  });
};

/* 
var schema = require('./schema');

var SensorManagement = schema.Sensor;

exports.createSensor = function (req,callback){
	var SensorManagement = new SensorManagement(req.body);
    SensorManagement.save(function(err) {
            callback(err);
    });
}

exports.updateSensor = function (query, conditions,callback){
	SensorManagement.findOne(query,function(err,SensorManagement){
		
		if(err)
			return callback(err,null);
		
		if(SensorManagement == null)
			return callback(new Error("SensorManagement not found"),null );
		
		for (var key in conditions){
			
			if(key == 'email'){
				return callback(new Error('Email property cannot be modified'), null)
			}

			if(SensorManagement[key] != null){
				console.log("SensorManagement key exist");
				SensorManagement[key] = conditions[key];
			}else{
				console.log("SensorManagement key does not exist");
				SensorManagement[key] = conditions[key];
			}
		}
		
		
		SensorManagement.save(callback)
	
	});
}

exports.removeSensor = function (req,callback){
	SensorManagement.remove({
            email : req.params.user_id
        }, function(err) {
            callback(err);
    });
} */
