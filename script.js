document.addEventListener("DOMContentLoaded", function () {
  const interestSelect = document.getElementById("interest");
  const dynamicFields = document.querySelectorAll(".dynamic-field");
  const form = document.getElementById("HCScustomerform");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const spinner = document.getElementById("spinner");

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwcPBgQh5_OvlVGylk5HtI_aSvTrB8fO92XhL5zQipaJdrml1Zwc0E21ABmsm4JYpT4wQ/exec";
  // ----------------------------
  // SHOW / HIDE DYNAMIC FIELDS
  // ----------------------------
  function showDynamicField() {
    const selectedValue = interestSelect.value;

    dynamicFields.forEach((field) => {
      field.style.display = "none";

      const inputs = field.querySelectorAll("input, select");
      inputs.forEach((input) => (input.disabled = true));
    });

    if (selectedValue) {
      const targetField = document.getElementById(`field-${selectedValue}`);

      if (targetField) {
        targetField.style.display = "block";

        const inputs = targetField.querySelectorAll("input, select");

        inputs.forEach((input) => (input.disabled = false));
      }
    }
  }

  showDynamicField();
  interestSelect.addEventListener("change", showDynamicField);

  // ----------------------------
  // CONVERT FILE TO BASE64
  // ----------------------------
  function fileToBase64(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = function () {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };

      reader.readAsDataURL(file);
    });
  }

  // ----------------------------
  // GET PORTFOLIO FILE
  // ----------------------------
  function getPortfolioFile() {
    const portfolioInputs = document.querySelectorAll(
      'input[type="file"][name^="portfolio_"]',
    );

    for (let input of portfolioInputs) {
      if (input.files.length > 0) {
        return input.files[0];
      }
    }

    return null;
  }

  // ----------------------------
  // GET SUB CATEGORY
  // ----------------------------
  function getSubCategory() {
    if (form.photography_type && form.photography_type.value)
      return form.photography_type.value;

    if (form.styling_type && form.styling_type.value)
      return form.styling_type.value;

    if (form.modeling_type && form.modeling_type.value)
      return form.modeling_type.value;

    if (form.designing_type && form.designing_type.value)
      return form.designing_type.value;

    if (form.makeup_type && form.makeup_type.value)
      return form.makeup_type.value;

    return "";
  }

  // ----------------------------
  // FORM SUBMIT
  // ----------------------------
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    btnText.innerText = "Submitting...";
    spinner.style.display = "inline-block";

    try {
      const resumeFile = form.resume.files[0];
      const portfolioFile = getPortfolioFile();

      const resumeBase64 = resumeFile ? await fileToBase64(resumeFile) : "";
      const portfolioBase64 = portfolioFile
        ? await fileToBase64(portfolioFile)
        : "";

      const data = {
        name: form.name.value,
        age: form.age.value,
        contact: form.contact.value,
        gender: form.gender.value,

        profile_url: form.profile_url.value,

        interest: form.interest.value,
        sub_category: getSubCategory(),

        instagram_id: form.instagram_id.value,
        youtube_link: form.youtube_link.value,

        resume_name: resumeFile ? resumeFile.name : "",
        resume_type: resumeFile ? resumeFile.type : "",
        resume_base64: resumeBase64,

        portfolio_name: portfolioFile ? portfolioFile.name : "",
        portfolio_type: portfolioFile ? portfolioFile.type : "",
        portfolio_base64: portfolioBase64,
      };

      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      console.log(result);

      if (result.status === "success") {
        btnText.innerText = "Submitted ✓";
        spinner.style.display = "none";

        alert("Application submitted successfully!");

        form.reset();
        showDynamicField();
      } else {
        alert("Submission failed: " + result.message);

        btnText.innerText = "Submit";
        spinner.style.display = "none";
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error("Error:", error);

      alert("Error submitting form.");

      btnText.innerText = "Submit";
      spinner.style.display = "none";
      submitBtn.disabled = false;
    }
  });

  // ----------------------------
  // BACKGROUND ANIMATION
  // ----------------------------
  let c = 45;

  function draw() {
    document.documentElement.style.setProperty("--direction", c++ + "deg");

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
});
