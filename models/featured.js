	var mongoose     = require('mongoose');
	var Schema       = mongoose.Schema;

	var FeaturedSchema   = new Schema({
		name: String,
		tags : [String],
		desc : String,
		images : [String],
		isActive: {type : Boolean, default : Boolean.true},
		featureType : {type : String, enum : ['app', 'account', 'modelfile'], default : 'app'},
		userId : {type : Schema.Types.ObjectId},
		created_at: { type: Date, default: (new Date()).getTime() },
		createdBy: { type: String, default: ""},
		updated_at: { type: Date, default: (new Date()).getTime() },
		updatedBy: { type: String, default: "" }}, 
		{toObject: {virtuals: true}, toJSON: {virtuals: true}
	});

	FeaturedSchema.set('toJSON', {
		transform: function(doc, ret, options) {
			delete ret.createdBy;
			delete ret.updatedBy;
			ret.created_at = ret.created_at.getTime();
			ret.updated_at = ret.updated_at.getTime();
			return ret;
		}
	});

	// FeaturedSchema.virtual('createdAt').get(function() {
	//  		return this.created_at.getTime();
	// });

	// 		FeaturedSchema.virtual('updatedAt').get(function() {
	//  		return this.updated_at.getTime();
	// });

	module.exports = mongoose.model('Featured', FeaturedSchema);