function importAll( r ) {
	r.keys().forEach( r );
}

// import tests in a certain order instead of importing them alphabetical
importAll( require.context( "qunit/test/", true, /\.js$/ ) );
importAll( require.context( "./nwjs/", true, /\.js$/ ) );
importAll( require.context( "./utils/", true, /\.js$/ ) );
importAll( require.context( "./helpers/", true, /\.js$/ ) );
importAll( require.context( "./models/", true, /\.js$/ ) );
importAll( require.context( "./store/", true, /\.js$/ ) );
importAll( require.context( "./initializers/", true, /\.js$/ ) );
importAll( require.context( "./mixins/", true, /\.js$/ ) );
importAll( require.context( "./routes/", true, /\.js$/ ) );
importAll( require.context( "./components/", true, /\.js$/ ) );
importAll( require.context( "./services/", true, /\.js$/ ) );
