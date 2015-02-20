Two things added to the original postgrator (create 2 pull requests)

1)

		if(targetVersion === currentVersion){
			console.log('nothing to do. goodbye!');
		}

I always have to run the "max" migration to make sure the db is up to date. If there is no new migrations I get the message

version of database is: 4
migrating up to 4

This means that no migration was run, but the message is not entirely clear.

With this pr the message will be:

version of database is: 4
migrating up to 4
nothing to do. goodbye!





2)

	var verifyChecksum = false;

    (we might want to add comments to the previous sql scripts; the md5 will then change so the new migrations will not be executed. the developer should know that the code in the previous migrations should not be changed)