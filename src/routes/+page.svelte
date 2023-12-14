<script lang="ts">
	/*
	TODO:
		update the code to take into consideration of ["income"].frequency
		link all the variables for the pi graph
		figure out d3 for svelte
		finish the table./OG look
	
	
	*/
	import { 
		Accordion, 
		AccordionItem, 
		Table, 
		tableMapperValues,
		TabGroup, 
		Tab, 
		TabAnchor,
		ConicGradient,
		ProgressBar,
		type ModalComponent, 
		getToastStore} from '@skeletonlabs/skeleton'
	
	import type { ConicStop, ModalSettings, ToastSettings } from '@skeletonlabs/skeleton';
	import moment from "moment"
	let tabSet: number = 0;

	
	import Icon from 'svelte-icons-pack';
	import FaSolidPiggyBank from "svelte-icons-pack/fa/FaSolidPiggyBank"
	import AiOutlineStock from "svelte-icons-pack/ai/AiOutlineStock";
	import FaSolidChartPie from "svelte-icons-pack/fa/FaSolidChartPie";
	import AiOutlineTable from "svelte-icons-pack/ai/AiOutlineTable";

	import { getModalStore } from '@skeletonlabs/skeleton';
				
	const modalStore = getModalStore();

	import addAssetM from '../Components/addAsset.svelte';
	import addGoalM from '../Components/addGoal.svelte';

	const modalComponentRegistry: Record<string, ModalComponent> = {
		addAssets: { ref: addAssetM },
		addGoals: { ref: addGoalM },
	};
	const addAssetModal: ModalSettings = {
			type: 'component',
			component: modalComponentRegistry['addAssets']
		}
	const addAsset = () => {
		modalStore.trigger(addAssetModal)
	}
	const addGoalModal: ModalSettings = {
			type: 'component',
			component: modalComponentRegistry['addGoals']
		}
	const addGoal = () => {
		modalStore.trigger(addGoalModal)
	}	
	const currency = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});

	const percent = Intl.NumberFormat('en-US', {
		style: 'percent',
		minimumFractionDigits: 2,
  		maximumFractionDigits: 2
	});
	let conicStops: ConicStop[] = [
		{ label: 'Assets', color: 'rgba(255,255,255,.78)', start: 0, end: 80 },
		{ label: 'Expenses', color: 'rgba(255,255,255,0.1)', start: 80, end: 100 }
	];
	//ONCE THIS IS BEING CREATED, THERE SHOULD BE A FUNCTION THAT TIES THE POSITION OR ID TO TIE THE ASSET AMOUNT TO THE GOAL
	/* 
	{ position: 1, name: 'Savings Bank Account', amount:  20000 , type: "Dollar"},
	{ position: 2, name: 'Cash', amount: 0 , type: "Dollar"},
	{ position: 3, name: 'Gold (Ounce Troy)', amount: .13 , type: "Quanitity"},
	{ position: 4, name: 'Silver (Ounce Troy)', amount: 24 , type: "Quanitity"}
	*/
	
	import data from "../user.json";
//	import data from "../mom.json"; //2250

	import { fly, slide } from 'svelte/transition';
	import { quintIn } from 'svelte/easing';
	let tableAssets = ([])
	let tableAssetGoals = ([])
	let tablePay = ([])
	let tableExpenses = ([])
	let totalExpensesAMonth = 0.0, totalExpensesStowedPerPC, totalIncomeMonthly = 0.0

	data[0]["tableAssets"].forEach((element, index) => {
		tableAssets.push(element)
		if(element["goalFlag"]){
			tableAssetGoals.push(element)
		}
	});
	data[1]["tableGoalsMisc"].forEach((element, index) => { 
		if(typeof element["amount"] === "string"){
			element["amount"] = tableAssets[element.position].amount 
		}
		tableAssetGoals.push(element)
	});
	data[2]["income"].forEach((element, index) => { 
		tablePay.push(element)
	});
	data[3]["expenses"].forEach((element, index) => { 
		tableExpenses.push(element)
		totalExpensesAMonth += element.Cost
	});
	/* this works, just implement that for functions like add asset but to make hard changes in the json figure that out
	 function saveDraft(){
		if(browser){
			localStorage.setItem("tableAssets", JSON.stringify(tableAssets))
		}
    }
    saveDraft()
	if(browser){
		console.log(JSON.parse(localStorage.getItem("tableAssets")))
	} */
	const toastStore = getToastStore()
	async function renderTimeLeft(daTing){
		let freq:number, addtionType:string;
		var goalAcheived: boolean = false;
		var curAmt = daTing[0];
		var goalAmt = daTing[1];
		var whatsLeft = goalAmt - curAmt;
		var motherPercentage, daughterPercentage;
		if(whatsLeft <= 0){
			goalAcheived = true
		}
		if( goalAcheived === false ){
			tableAssets.forEach((element, index) => {
				if(tableAssets[index].name === daTing[2]){
					if(tableAssets[index].NW === "Need"){
						motherPercentage = .8
						daughterPercentage = tableAssetGoals[index].PercentageOfSavingStowed
					} else {
						motherPercentage = .2
						daughterPercentage = 1
					}
				}
			});
			tableAssetGoals.forEach((element, index) => {
				if(tableAssetGoals[index].name === daTing[2]){
					if(tableAssetGoals[index].NW === "Need"){
						motherPercentage = .8
						daughterPercentage = tableAssetGoals[index].PercentageOfSavingStowed
					}else {
						motherPercentage = .2
						daughterPercentage = 1
					}
				}
			});
			switch(tablePay[0].frequency){
				case("daily"):
					break;
				case("weekly"):
					
					break;
				case("bi"):
					freq = 2 // in a month
					addtionType = "weeks"
					break;
				case("monthly"):
					break;
				case("x"): //you would store the amount of months you would wait for payment for your services
					break;
			
			}
			totalExpensesStowedPerPC = Math.ceil(totalExpensesAMonth / freq)
			totalIncomeMonthly = (tablePay[0].pay * tablePay[0].projectedHours * freq * freq)
			console.log(totalIncomeMonthly)
			var earnedIn1PP = ((tablePay[0].pay * tablePay[0].projectedHours * freq) - totalExpensesStowedPerPC) * ( motherPercentage * daughterPercentage) //.8 is the savings amount from paycheck put towards goals
			var numOfPayChecks
			if( daTing[2] == "Gold (Ounce Troy)" ){
				const response = fetch(tableAssets[2].link).then(res => res.json())
				.then(data => {
						numOfPayChecks = Math.ceil((data["items"][0].xauPrice * whatsLeft) / earnedIn1PP)
						var stringy = "You won\'t have to buy any more" + " " +
							moment().add(numOfPayChecks * freq, addtionType).fromNow() + " (" +
							moment().add(numOfPayChecks * freq, addtionType).calendar() + ") ≈" +
							numOfPayChecks + " paychecks" +
							" based on the price ($"+ data["items"][0].xauPrice +"/ozt) as of " + data["date"];
						const toasty: ToastSettings = {
							message: stringy,
							action: {
								label: "View Chart",
								response: ()=>{
									window.open("https://goldprice.org/spot-gold.html", "_blank")
								}
							},
							background: 'variant-filled-success',
							autohide: false,
							classes: "text-center"
						}
						toastStore.trigger(toasty)

					});
				/* await response.then((res)=>{.24 change truck once emergency food is complete, new should be .8*.3*(whatever percentage you deem fit for the rest)
					console.log(res)
				}) */
			} else if (daTing[2] == "Silver (Ounce Troy)"){
				const response = fetch(tableAssets[2].link).then(res => res.json())
				.then(data => {
						numOfPayChecks = Math.ceil((data["items"][0].xagPrice * whatsLeft) / earnedIn1PP)
						var stringy = "You won\'t have to buy any more" + " " +
							moment().add(numOfPayChecks * freq, addtionType).fromNow() + " (" +
							moment().add(numOfPayChecks * freq, addtionType).calendar() + ") ≈" +
							numOfPayChecks + " paychecks" +
							" based on the price ($"+ data["items"][0].xagPrice +"/ozt) as of " + data["date"];
						const toasty: ToastSettings = {
							message: stringy,
							action: {
								label: "View Chart",
								response: ()=>{
									window.open("https://goldprice.org/silver-price.html", "_blank")
								}
							},
							background: 'variant-filled-success',
							autohide: false,
							classes: "text-center"
						}
						toastStore.trigger(toasty)
					});
			} else {
				var numOfPayChecks = Math.ceil( goalAmt / earnedIn1PP )
				var done = numOfPayChecks * freq //express in days, weeks, months, etc *may have to make special case for x months
				tableAssetGoals.forEach(element => {
					if(element.name === daTing[2]){
						console.log(element)
					}
				});
				var stringy = "You won\'t have to save any more " +
								moment().add(done, addtionType).fromNow() + " (" +
								moment().add(done, addtionType).calendar() + ") ≈" +
								numOfPayChecks + " paychecks, taking out: $" +
								Math.ceil(earnedIn1PP) + " per paycheck for the " + daTing[2];
				const toasty: ToastSettings = {
					message: stringy,
					background: 'variant-filled-success',
					autohide: false,
					classes: "text-center"
				}
				toastStore.trigger(toasty)
			}
		}
	}

</script>

<div class="flex justify-center items-center">
	<div class="xs:w-11/12 w-9/12">
		<div> <!-- put viewport here ( graph, pie chart ) -->
			<TabGroup>
				<Tab bind:group={tabSet} name="tab1" value={0}>
					<svelte:fragment slot="lead"> <Icon src={FaSolidChartPie} color="white" size="32px"/> </svelte:fragment>
				</Tab>
				<Tab bind:group={tabSet} name="tab2" value={1}>
					<Icon src={AiOutlineStock} color="white" size="32px"/>
				</Tab>
				<Tab bind:group={tabSet} name="tab2" value={2}>
					<Icon src={AiOutlineTable} color="white" size="32px"/>
				</Tab>
				
				<!-- Tab Panels --->
				<svelte:fragment slot="panel">
					{#if tabSet === 0}
						<div in:fly={{easing:quintIn}} out:slide>
							<ConicGradient stops={conicStops} legend width="xs:w-3/4 md:w-1/2"> Totals </ConicGradient><!-- so in theory there should be reactive if statement that will change the conic gradient (in a cool animation) that will show the information you want -->
						</div>
					{:else if tabSet === 1}
						Put da chart a da ting a da bing a ling
					{:else if tabSet === 2}
						<div class="table-container" in:fly={{easing:quintIn}} out:slide>
							<!-- Native Table Element -->
							<table class="table table-interactive text-center">
								<thead>
									<tr >
										<th class="text-center">Time Frame</th>
										<th class="text-center">Base</th>
										<th class="text-center">Bills</th>
										<th class="text-center">Take Home</th>
										<th class="text-center">Savings (80%)</th>
										<th class="text-center">Spendings (10%)</th>
										<th class="text-center">STONKS (10%)</th>
									</tr>
								</thead>
								<tbody>
								
								</tbody>
							</table>
						</div>
					{/if}
				</svelte:fragment>
			</TabGroup>
			
		</div>
		<hr class="my-4"/>
		<div class="flex justify-center"> <!-- put glance shit here -->
			<div class="w-full">
				<Accordion>
					<AccordionItem open>
						<svelte:fragment slot="lead"> <Icon src={FaSolidPiggyBank} color="white" size="32px"/> </svelte:fragment>
						<svelte:fragment slot="summary">Assets | Total: { totalIncomeMonthly } </svelte:fragment>
						<svelte:fragment slot="content">

						<!-- Responsive Container (recommended) -->
						<div class="table-container">
							<!-- Native Table Element -->
							<table class="table table-interactive text-center">
								<thead>
									<tr >
										<th class="text-center">Asset Name</th>
										<th class="text-center">Amount</th>
									</tr>
								</thead>
								<tbody>
									{#each tableAssets as row}
										<tr>
											<td>{row.name}</td>
											{#if row.type === "Dollar"}
												<td>{currency.format(row.amount)}</td>
											{:else}
												<td>{row.amount}</td>
											
											{/if}
										</tr>
									{/each}
								</tbody>
								<tfoot>
									<tr >
										<td class="text-center" colspan="2">
											<button class="btn variant-filled rounded-full" on:click={() => addAsset()}>
												Add Asset &nbsp; <strong class='text-[26px]'> + </strong> 
											</button>
										</td>
									</tr>
								</tfoot>
							</table>
						</div>

							<hr class="my-3"/>
							
							<div class="table-container">
								<!-- Native Table Element -->
								<table class="table table-interactive text-center">
									<thead>
										<tr >
											<th class="text-center">Goals</th> <!-- idea: on click for the title, show the history just for that, or if tabset on pie, show how much out of assets it takes -->
											<th class="text-center">Progress 🚀</th>
										</tr>
									</thead>
									<tbody>
										{#each tableAssetGoals as row}
											<tr>
												<td>{row.name}</td>
													<td on:click={() => renderTimeLeft([row.amount, row.goal, row.name])} id={row.name + " Goal"}>
														{#if row.type === "Dollar"}
															{currency.format(row.amount)} / {currency.format(row.goal)} ( { percent.format(row.amount / row.goal) } )<ProgressBar label="Progress Bar" value={row.amount} max={row.goal} />
														{:else}
															{row.amount} / {row.goal} ( { percent.format(row.amount / row.goal) } ) <ProgressBar label="Progress Bar" value={row.amount} max={row.goal} />
														{/if}
													</td>
												</tr>
										{/each}
									</tbody>
									<tfoot>
										<tr >
											<td class="text-center" colspan="2">
												<button class="btn variant-filled rounded-full" on:click={() => addGoal()}>
													Add Goal &nbsp; <strong class='text-[26px]'> + </strong> 
												</button>
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
							
							<hr class="my-3"/>
						</svelte:fragment>
					</AccordionItem>
					<AccordionItem>
						<svelte:fragment slot="lead"><p class="text-[32px]">📉</p></svelte:fragment>
						<svelte:fragment slot="summary">Expenses | Total: {currency.format(totalExpensesAMonth)}</svelte:fragment>
						<svelte:fragment slot="content">
							<p class="text-center">{currency.format(Math.ceil(totalExpensesAMonth / 2))} should be taken out per paycheck</p>
							<div class="table-container" in:fly={{easing:quintIn}} out:slide>
								<!-- Native Table Element -->
								<table class="table table-interactive text-center">
									<thead>
										<tr >
											<th class="text-center">Name</th>
											<th class="text-center">Cost</th>
											<th class="text-center">Frequency</th>
										</tr>
									</thead>
									<tbody><!-- GAS MATH 300 miles of range / 25 miles every weekday, x resivoir, $4/gallon -->
										{#each tableExpenses as row}
											<tr>
												<td>{row.Name}</td>
												<td>{currency.format(row.Cost)}</td>
												<td>{row.frequency}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</svelte:fragment>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	</div>
</div>

<!-- 
	idea:
		integrate a way to keep track of asset prices unit weight or quantity
		everytime you buy new quantity, just add more to unit weight or quantity and multiply that with the price, subtract the cost, output that
		graph profits https://data-asg.goldprice.org/dbXRates/USD

	on top of that we can have different views for each item

	At a glance {
		Assets{
			savings bank account
			cash
			metals
			(add button)
			____________________

			goals{
				<Progress Bar/> x%, date (Tooltip x days) $500
				(add button)
			}
		}
		Expenses{
			Debts {
				x <Progress Bar/> x%, date (Tooltip x days) $1500 (),
				y
			}
			(add button)
		}
		total since ( date )
	}

	Steps {
		bills
		income
		assets
		goals
	}

	flow should be as follows
	if (firstTime){
		askEm Questions or give them option to skip and add manually
	}

	if (localStorage){
		just display what they have
	}

	known variables

	Expenses {
		x itemized (categorized *should have a tree probs accordian*)
		EX:
		Needs (total) {
			Living Expenses {
				Rent
				Food
				Electric (etc)

			}
			Business Expenses {
				Rent
				Electric
			}
		}
		Wants {
			Car (payments, savings)
		}
		
	}

	payType = hourly || salary || contract (over a period of time)
	
	paySchedule = Daily || Weekly || Bi-Weekly || Monthly || x Months
	
	swtich(payType){
		case( hourly ){

		}
		case( salary ){

		}
		case( contract ){

		}
	}

	iteration 1:
		income * time - bills * time = leftover

		savings = leftover * savings percentage

		spendings = leftover * spendings percentage

		savings * item percentage (there should be a function to determine a date when you should have enough)

		itemGoalTimeCalc(){
			//returns goal date, subsequently the time left ( probably separate function )
			itemGoalPrice = x
			
			goalDate*time* = paySchedule * income
			 
		}

 -->