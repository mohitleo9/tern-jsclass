const Simple = JS.class('Simple', {
	methods : {
		method1 : function() {},

		method2 : function() {
		},

		auth : Promise.wrapGenerator(function*() {
			return (yield Promise.ajax('/asdf')).data;
		}),
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
