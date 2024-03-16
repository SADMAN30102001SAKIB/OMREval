var flag = true;
document.getElementById("form2").style.display = "none";
document.getElementById("setNo").style.display = "none";
document.getElementById("spanDisplay").style.display = "none";
document.getElementById("form2q").style.maxHeight = "45vh";
document.getElementById("form3q").style.display = "none";
document.getElementById("form4q").style.display = "none";
document.getElementById("form5q").style.display = "none";
var val = 1;

display = (str1, str2) => {
  if (document.getElementById(str1).checked) {
    document.getElementById(str2).style.display = "block";
  } else {
    document.getElementById(str2).style.display = "none";
  }
};

function addQuestions(n) {
  arr = ["form2q", "form3q", "form4q", "form5q"];
  for (let k = 1; k <= val; k++) {
    const form = document.getElementById(arr[k - 1]);
    char = ["A", "B", "C", "D"];
    form.innerHTML = "";
    for (let i = 1; i <= n; i++) {
      const label = document.createElement("label");
      if (i < 10) {
        label.innerHTML = `Q- - ${i}: `;
      } else if (i < 100) {
        label.innerHTML = `Q- ${i}: `;
      } else {
        label.innerHTML = `Q${i}: `;
      }
      for (let j = 0; j < 4; j++) {
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `set${k}Q${i}`;
        input.value = j + 1;
        if (j === 0) {
          input.setAttribute("checked", "checked");
        }
        label.appendChild(input);
        label.innerHTML += `${char[j]}&nbsp;&nbsp;|`;
      }
      const wqInput = document.createElement("input");
      wqInput.type = "radio";
      wqInput.name = `set${k}Q${i}`;
      wqInput.id = `set${k}Q${i}Wq`;
      wqInput.value = "-1";
      label.appendChild(wqInput);
      label.innerHTML += "W/Q";
      form.appendChild(label);
      form.appendChild(document.createElement("br"));
    }
  }
}
addQuestions(100);

function updateWqValues(selectedValue) {
  for (let j = 1; j <= val; j++) {
    for (
      let i = 1;
      i <= document.querySelector('input[name="questionsCount"]').value;
      i++
    ) {
      const wqInput = document.getElementById(`set${j}Q${i}Wq`);
      if (wqInput) {
        wqInput.value = selectedValue;
      }
    }
  }
}

function setupWqCaseListeners() {
  const wqCases = document.querySelectorAll('input[name="setWq"]');
  wqCases.forEach((caseInput) => {
    caseInput.addEventListener("change", function () {
      updateWqValues(this.value);
    });
  });
}
setupWqCaseListeners();

document.getElementById("download").addEventListener("click", function (event) {
  event.preventDefault();

  const formData = new FormData(document.getElementById("form"));
  var string = "";
  document.getElementById("download").innerText = "Loading" + string;

  if (
    ((parseInt(formData.get("questionsCount")) <= 35 &&
      document.getElementById("file-upload").files.length == 1) ||
      (parseInt(formData.get("questionsCount")) > 35 &&
        document.getElementById("file-upload").files.length == 1 &&
        document.getElementById("file-upload2").files.length == 1)) &&
    parseInt(formData.get("rollDigit")) >= 1 &&
    parseInt(formData.get("rollDigit")) <= 11 &&
    parseInt(formData.get("questionsCount")) >= 1 &&
    parseInt(formData.get("questionsCount")) <= 100 &&
    flag
  ) {
    flag = false;
    var error, marks, idno, setno;
    var ref = setInterval(() => {
      string += " .";
      if (string.length > 6) {
        string = "";
      }
      document.getElementById("download").innerText = "Loading" + string;
    }, 1000);
    fetch(
      "https://sakib30102001.pythonanywhere.com/upload",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => {
        error = response.headers.get("error");
        marks = response.headers.get("marks");
        idno = response.headers.get("idno");
        setno = response.headers.get("setno");
        if (error || marks || idno || setno) {
          return response.blob();
        } else {
          throw response.text;
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "output.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        clearInterval(ref);
        document.getElementById("download").innerText = "Evaluate";
        if (error) {
          alert(error);
        } else if (setno && idno && marks) {
          alert(
            `ID: ${Number(idno)}` +
              "\n" +
              `Set: ${Number(setno)}` +
              "\n" +
              `Score: ${Number(marks)}`
          );
        } else if (marks && setno) {
          alert(`Set: ${Number(setno)}` + "\n" + `Score: ${Number(marks)}`);
        } else if (marks && idno) {
          alert(`ID: ${Number(idno)}` + "\n" + `Score: ${Number(marks)}`);
        } else if (marks) {
          alert(`Score: ${Number(marks)}`);
        }
        flag = true;
      })
      .catch((error) => {
        clearInterval(ref);
        document.getElementById("download").innerText = "Evaluate";
        alert(`Error: ${error}`);
        flag = true;
      });
  } else if (flag) {
    alert("Please enter inputs carefully");
    document.getElementById("download").innerText = "Evaluate";
  }
});

document.getElementById("rollBox1").addEventListener("click", () => {
  display("rollBox1", "rollDigit");
});

document.getElementById("rollBox2").addEventListener("click", () => {
  display("rollBox1", "rollDigit");
});

document.getElementById("negativeBox1").addEventListener("click", () => {
  display("negativeBox1", "negativeMark");
  if (document.getElementById("negativeBox1").checked) {
    document.getElementById("displayWq").style.display = "block";
    document.getElementById("spanDisplay").style.display = "none";
    document.getElementById("displayWqRb").style.display = "inline-block";
    document.getElementById("setWq").checked = true;
    updateWqValues("-1");
  } else {
    document.getElementById("displayWq").style.display = "none";
    document.getElementById("spanDisplay").style.display = "block";
    document.getElementById("displayWqRb").style.display = "none";
    document.getElementById("setWq").checked = true;
    updateWqValues("-1");
  }
});

document.getElementById("negativeBox2").addEventListener("click", () => {
  display("negativeBox1", "negativeMark");
  if (document.getElementById("negativeBox1").checked) {
    document.getElementById("displayWq").style.display = "block";
    document.getElementById("spanDisplay").style.display = "none";
    document.getElementById("displayWqRb").style.display = "inline-block";
    document.getElementById("setWq").checked = true;
    updateWqValues("-1");
  } else {
    document.getElementById("displayWq").style.display = "none";
    document.getElementById("spanDisplay").style.display = "block";
    document.getElementById("displayWqRb").style.display = "none";
    document.getElementById("setWq").checked = true;
    updateWqValues("-1");
  }
});

document.getElementById("custom-button").addEventListener("click", function () {
  document.getElementById("file-upload").click();
});

document.getElementById("file-upload").addEventListener("change", function () {
  var files = document.getElementById("file-upload").files;
  document.getElementById("file-name").textContent = files.length
    ? files[0].name
    : "No img chosen";
});

document
  .getElementById("custom-button2")
  .addEventListener("click", function () {
    document.getElementById("file-upload2").click();
  });

document.getElementById("file-upload2").addEventListener("change", function () {
  var files = document.getElementById("file-upload2").files;
  document.getElementById("file-name2").textContent = files.length
    ? files[0].name
    : "No img chosen";
});

document
  .querySelector('input[name="questionsCount"]')
  .addEventListener("change", function () {
    addQuestions(document.querySelector('input[name="questionsCount"]').value);
    document.getElementById("setWq").checked = true;
    updateWqValues("-1");
    if (document.querySelector('input[name="questionsCount"]').value > 35) {
      document.getElementById("2ndFile").style.display = "block";
    } else {
      document.getElementById("2ndFile").style.display = "none";
    }
  });

document.getElementById("next").addEventListener("click", function () {
  document.getElementById("form2").style.display = "block";
  document.getElementById("form1").style.display = "none";
});

document.getElementById("prev").addEventListener("click", function () {
  document.getElementById("form1").style.display = "block";
  document.getElementById("form2").style.display = "none";
});

document.querySelectorAll('input[name="setCount"]').forEach((caseInput) => {
  caseInput.addEventListener("change", function () {
    val = caseInput.value;
    addQuestions(document.querySelector('input[name="questionsCount"]').value);
    document.getElementById("setWq").checked = true;
    updateWqValues("-1");
    document.getElementById("form2q").style.display = "block";
    document.getElementById("form3q").style.display = "none";
    document.getElementById("form4q").style.display = "none";
    document.getElementById("form5q").style.display = "none";
    if (val == "1") {
      document.getElementById("setNo").style.display = "none";
      document.getElementById("form2q").style.maxHeight = "45vh";
      document.getElementById("form3q").style.maxHeight = "45vh";
      document.getElementById("form4q").style.maxHeight = "45vh";
      document.getElementById("form5q").style.maxHeight = "45vh";
      document.getElementById("set1").checked = true;
    } else if (val == "2") {
      document.getElementById("setNo").style.display = "block";
      document.getElementById("set3").style.display = "none";
      document.getElementById("set4").style.display = "none";
      document.getElementById("form2q").style.maxHeight = "40vh";
      document.getElementById("form3q").style.maxHeight = "40vh";
      document.getElementById("form4q").style.maxHeight = "40vh";
      document.getElementById("form5q").style.maxHeight = "40vh";
      document.getElementById("set1").checked = true;
    } else if (val == "3") {
      document.getElementById("setNo").style.display = "block";
      document.getElementById("set3").style.display = "inline-block";
      document.getElementById("set4").style.display = "none";
      document.getElementById("form2q").style.maxHeight = "40vh";
      document.getElementById("form3q").style.maxHeight = "40vh";
      document.getElementById("form4q").style.maxHeight = "40vh";
      document.getElementById("form5q").style.maxHeight = "40vh";
      document.getElementById("set1").checked = true;
    } else {
      document.getElementById("setNo").style.display = "block";
      document.getElementById("set3").style.display = "inline-block";
      document.getElementById("set4").style.display = "inline-block";
      document.getElementById("form2q").style.maxHeight = "40vh";
      document.getElementById("form3q").style.maxHeight = "40vh";
      document.getElementById("form4q").style.maxHeight = "40vh";
      document.getElementById("form5q").style.maxHeight = "40vh";
      document.getElementById("set1").checked = true;
    }
  });
});

document.querySelectorAll('input[name="setNo"]').forEach((caseInput) => {
  caseInput.addEventListener("change", function () {
    var value = caseInput.value;
    if (value == "1") {
      document.getElementById("form2q").style.display = "block";
      document.getElementById("form3q").style.display = "none";
      document.getElementById("form4q").style.display = "none";
      document.getElementById("form5q").style.display = "none";
    } else if (value == "2") {
      document.getElementById("form2q").style.display = "none";
      document.getElementById("form3q").style.display = "block";
      document.getElementById("form4q").style.display = "none";
      document.getElementById("form5q").style.display = "none";
    } else if (value == "3") {
      document.getElementById("form2q").style.display = "none";
      document.getElementById("form3q").style.display = "none";
      document.getElementById("form4q").style.display = "block";
      document.getElementById("form5q").style.display = "none";
    } else {
      document.getElementById("form2q").style.display = "none";
      document.getElementById("form3q").style.display = "none";
      document.getElementById("form4q").style.display = "none";
      document.getElementById("form5q").style.display = "block";
    }
  });
});
