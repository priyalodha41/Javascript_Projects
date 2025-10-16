const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTableBody");
const clearBtn = document.getElementById("clearBtn");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const editIndexInput = document.getElementById("editIndex");

const inputs = ["name", "age", "gender", "studentId", "course", "phone", "email"];
let students = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const student = {};
  for (let id of inputs) student[id] = document.getElementById(id).value.trim();
  if (Object.values(student).some(val => val === "")) {
    Swal.fire({
      icon: "warning",
      title: "Incomplete Information",
      text: "Kindly complete all fields before submitting!"
    });
    return;
  }
  const editIndex = editIndexInput.value;
  if (editIndex === "") {
    students.push(student);
    Swal.fire({
      icon: "success",
      title: "Student Added!",
      text: "New student information has been successfully saved.",
      timer: 1500,
      showConfirmButton: false
    });
  } else {
    students[editIndex] = student;
    editIndexInput.value = "";
    formTitle.textContent = "Add New Student";
    submitBtn.textContent = "Add Student";
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Student information has been updated.",
      timer: 1500,
      showConfirmButton: false
    });
  }
  form.reset();
  displayStudents();
});

function displayStudents() {
  tableBody.innerHTML = "";
  if (students.length === 0) {
    tableBody.innerHTML = `<tr class="text-muted text-center"><td colspan="8">No students found</td></tr>`;
    return;
  }
  students.forEach((s, index) => {
    const row = `
      <tr>
        <td>${s.name}</td>
        <td>${s.age}</td>
        <td>${s.gender}</td>
        <td>${s.studentId}</td>
        <td>${s.course}</td>
        <td>${s.phone}</td>
        <td>${s.email}</td>
        <td>
            <div class="d-flex align-items-center gap-2 justify-content-center">
                <button class="btn btn-success btn-sm" onclick="editStudent(${index})">
                <i class="ri-pencil-line"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent(${index})">
                <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        </td>
      </tr>`;
    tableBody.innerHTML += row;
  });
}

window.editStudent = (index) => {
  const s = students[index];
  for (let id of inputs) document.getElementById(id).value = s[id];
  editIndexInput.value = index;
  formTitle.textContent = "Edit Student";
  submitBtn.textContent = "Update Student";
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteStudent = (index) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This will permanently delete the student data!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      students.splice(index, 1);
      displayStudents();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Student data has been removed.",
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
};

clearBtn.addEventListener("click", () => {
  Swal.fire({
    title: "Clear Form?",
    text: "All entered information will be lost!",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, clear it",
    cancelButtonText: "No, keep it"
  }).then((result) => {
    if (result.isConfirmed) {
      form.reset();
      editIndexInput.value = "";
      formTitle.textContent = "Add New Student";
      submitBtn.textContent = "Add Student";
    }
  });
});
