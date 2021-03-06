import { Application } from "ember";
import { providers } from "models/localstorage/Settings/chatProvider";
import Serializer from "models/localstorage/Settings/chatProviderSerializer";


Application.initializer({
	name: "settings-chat-provider",

	initialize( application ) {
		for ( const [ type, model ] of providers ) {
			application.register( `model:settings-chat-provider-${type}`, model );
			application.register( `serializer:settings-chat-provider-${type}`, Serializer );
		}
	}
});
