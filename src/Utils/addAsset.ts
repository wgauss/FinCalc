//couldn't be fucked

import { browser } from "$app/environment";

export function addAsset(dataFromForm){
	if(browser){
		const fs = require("fs")

		fs.readFile("../../user.json", (err, data)=>{
			if (err) throw err;
			console.log(data,dataFromForm)
		})
	}
		
}