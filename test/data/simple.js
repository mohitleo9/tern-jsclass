const Simple = JS.class('Simple', {
	methods : {
		method1 : function() {},

		method2 : function() {
		},
	},
	fields : {
		f1 : {
			type        : String,
			init        : null,
			persistable : true,
		},

		f2 : {
			type        : Date,
			init        : null,
			persistable : true,
		},
	},

	static : {
		fields : {
			current : {
				type : Number,
			},
		},

		methods : {
			st : function() { },
		},
	},
});
