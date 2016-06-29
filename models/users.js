	var mongoose     = require('mongoose');
	var Schema       = mongoose.Schema;
	var passport = require('passport');
	var passportLocalMongoose = require('passport-local-mongoose');

	var UserSchema   = new Schema({
		name: String,
		email: String,
		username : String,
		password : String,
		userRole: {type: String, enum : ['admin', 'normal'], default: 'normal'},
		profileImage: String,
		created_at: { type: Date, default: (new Date()).getTime() },
		createdBy: { type: String, default: ""},
		updated_at: { type: Date, default: (new Date()).getTime() },
		updatedBy: { type: String, default: "" }}, 
		{toObject: {virtuals: true}, toJSON: {virtuals: true}
	});

	UserSchema.set('toJSON', {
		transform: function(doc, ret, options) {
			delete ret.createdBy;
			delete ret.updatedBy;
			ret.created_at = ret.created_at.getTime();
			ret.updated_at = ret.updated_at.getTime();
			return ret;
		}
	});

	UserSchema.plugin(passportLocalMongoose);

	module.exports = mongoose.model('Users', UserSchema);