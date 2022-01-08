// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;
const jeopardyBoard = $("#jeopardy");
let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

function getCategoryIds(catIds) {
    let randomIds = _.sampleSize(catIds.data, NUM_CATEGORIES);
    let categoryIds = [];
    for (cat of randomIds) {
        categoryIds.push(cat.id)
    }
    return categoryIds;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

function getCategory(catId) {
    let cat = catId.data;
    let clues = _.sampleSize(cat, NUM_QUESTIONS_PER_CAT);
    let catData = {
        title: cat[0].category.title,
        clues: []
    }

    clues.map((arr) => {
        let cluesArr = {
            quesion: arr.question,
            answer: arr.answer,
            showing: null
        };
        catData.clues.push(cluesArr);
    });

    categories.push(catData);
};

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    let titles = categories.map((title) => {
        return title.title;
    });
    $("thead").add("tr");
    for (let x = 0; x < NUM_CATEGORIES; x++) {
        const row = document.createElement("tr");
        for (let x = 0; x < NUM_CATEGORIES; x++) {
            const cell = document.createElement("td");
            cell.innerHTML = `<div id=${x}-${y}>?</div>`;
            row.append(cell);
        }
        jeopardyBoard.append(row);
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let x = e.target.id[0];
	let y = e.target.id[2];
	// if answer is displayed, do nothing
	if (e.target.classList.contains("answer")) {
		return;
		// if question is displayed, display answer instead
	} else if (e.target.classList.contains("question")) {
		e.target.innerText = categories[x].clues[y].answer;
		e.target.classList.remove("question");
		e.target.classList.add("answer");
		// if nothing is displayed yet, display question
	} else {
		e.target.innerText = categories[x].clues[y].question;
		e.target.classList.add("question");
	}
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    const resCategories = await axios.get("http://jservice.io/api/categories", {
		params: {
			count: 100
		}
	});
	let catIds = getCategoryIds(resCategories);

	for (id of catIds) {
		// for each id, get clue data from jservoce.io
		const resTitles = await axios.get("http://jservice.io/api/clues", {
			params: {
				category: id
			}
		});
		getCategory(resTitles);
	}
	fillTable();
}

/** On click of start / restart button, set up game. */
$("#restart").on("click", function() {
	location.reload();
});
// TODO

/** On page load, add event handler for clicking clues */
$(document).ready(function() {
	setupAndStart();
	$("#jeopardy").on("click", "div", handleClick);
});
// TODO