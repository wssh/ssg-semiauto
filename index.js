module.exports = function crTest(dispatch) {
	
	let CID = null;
	let boss = undefined;
	let teleLocation = null;
	
	const firstboss = [[494,5010],[494,5008],[494,5006]];
	const secondboss = [494,5021];
	const thirdboss = [[494,5031],[494,5033],[494,5032]];
	const fourthboss = [[494,5049],[494,5050],[494,5051]];
	const coordinates = [[33672, 175732, -3830], [42558.51953125, 177701.953125, -2385.494384765625], [47934.5, 173592.171875, -228.57579040527344], [58364.3828125, 177338.046875, 1516.75671338671875], [71368.953125, 171973.8125, 3312.543212890625]];
	
	var bossDead = [false, false, false];
	var bossId = [[0, 0],[0, 0],[0, 0],[0, 0]];
	
	dispatch.hook('S_LOGIN', 1, event => {
		CID = event.cid;
	})
	
	dispatch.hook('cChat', 1 , (event) => {
		if(event.message.includes('!ssg')){
			dispatch.hookOnce('S_SPAWN_ME', 1, event => {
				if(coordinates[0][0] == event.x && coordinates[0][1] == event.y && coordinates[0][2] == event.z)
				{
					spawnTele();
					return false;
				}
				//console.log(event.x + ' ' + event.y + ' ' + event.z + ' ' + event.w);
				//console.log(coordinates[0][0] + ' ' + coordinates[0][1] + ' ' + coordinates[0][2]);
			})
			return false;
		}
	});
	
	dispatch.hook('S_BOSS_GAGE_INFO', 2, (event) => {
		if ((event.huntingZoneId === firstboss[0][0] && event.templateId === firstboss[0][1])||(event.huntingZoneId === firstboss[1][0] && event.templateId === firstboss[1][1])||(event.huntingZoneId === firstboss[2][0] && event.templateId === firstboss[2][1])) {
			boss = event;
			bossId[0][0] = boss.huntingZoneId;
			bossId[0][1] = boss.templateId;
		}
		
		else if (event.huntingZoneId === secondboss[0] && event.templateId === secondboss[1]){
			boss = event;
			bossId[1][0] = boss.huntingZoneId;
			bossId[1][1] = boss.templateId;
		}
		
		else if ((event.huntingZoneId === thirdboss[0][0] && event.templateId === thirdboss[0][1])||(event.huntingZoneId === thirdboss[1][0] && event.templateId === thirdboss[1][1])||(event.huntingZoneId === thirdboss[2][0] && event.templateId === thirdboss[2][1])) {
			boss = event;
			bossId[2][0] = boss.huntingZoneId;
			bossId[2][1] = boss.templateId;
		}
		
		else if ((event.huntingZoneId === fourthboss[0][0] && event.templateId === fourthboss[0][1])||(event.huntingZoneId === fourthboss[1][0] && event.templateId === fourthboss[1][1])||(event.huntingZoneId === fourthboss[2][0] && event.templateId === fourthboss[2][1])) {
			boss = event;
			bossId[3][0] = boss.huntingZoneId;
			bossId[3][1] = boss.templateId;
		}

		if (boss) {
			let bossHp = bossHealth();
			if (bossHp <= 0 && bossDead[0] == false && boss.huntingZoneId === bossId[0][0] && boss.templateId === bossId[0][1]) {
				boss = undefined;
				bossDead[0] = true;
				bossTele(coordinates[2]);
			}
			
			else if (bossHp <= 0 && bossDead[0] == true && boss.huntingZoneId === bossId[1][0] && boss.templateId === bossId[1][1]) {
				boss = undefined;
				bossDead[1] = true;
				bossTele(coordinates[3]);
			}
			
			else if (bossHp <= 0 && bossDead[1] == true && boss.huntingZoneId === bossId[2][0] && boss.templateId === bossId[2][1]) {
				boss = undefined;
				bossDead[2] = true;
				bossTele(coordinates[4]);
			}
			
			else if (bossHp <= 0 && bossDead[2] == true && boss.huntingZoneId === bossId[3][0] && boss.templateId === bossId[3][1]) {
				boss = undefined;
				console.log("resetting ssg");
				bossDead[0] = false;
				bossDead[1] = false;
				bossDead[2] = false;
			}
			
		}
	 })
	 
	 	
	function bossHealth() {
		return (boss.curHp / boss.maxHp);
	}
	
	function spawnTele()
	{
		dispatch.toClient('S_SPAWN_ME', 1, {
			target: CID,
			x: coordinates[1][0],
			y: coordinates[1][1],
			z: coordinates[1][2],
			alive: 1,
			unk: 0
		})
	}
	
		function bossTele(coordinates)
	{
		teleLocation = {
			x: coordinates[0],
			y: coordinates[1],
			z: coordinates[2]
		};
		dispatch.toClient('S_INSTANT_MOVE', 1, Object.assign(teleLocation, { id: CID}))
	}
}

