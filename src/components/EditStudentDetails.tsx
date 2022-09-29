import React from "react";
import { TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

export const EditStudentDetails = (props: {
  selectedStudentDetails: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  editState: boolean;
  setEditState: any;
}) => {
  type Params = {
    user: string;
    classID: string;
  };
  const { user, classID } = useParams<keyof Params>() as Params;

  type StudentDetailsData = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };

  //this exists as a value to compare updates against to determine if there's been a change
  const [initialStudentDetails, setInitialStudentDetails] =
    React.useState<StudentDetailsData>({
      id: "",
      firstname: "",
      lastname: "",
      email: "",
    });
  const [updatedStudentDetails, setUpdatedStudentDetails] =
    React.useState<StudentDetailsData>({
      id: "",
      firstname: "",
      lastname: "",
      email: "",
    });

  function textFieldChangeHandler(event: any) {
    setUpdatedStudentDetails({
      ...updatedStudentDetails,
      [event.target.name]: event.target.value,
    });
  }

  async function submitStudentDetailChanges(
    studentDetails: StudentDetailsData
  ) {
    let response = await fetch(
      `http://localhost:8000/${user}/${classID}/students/${props.selectedStudentDetails.id}`,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          Origin: "localhost:8000",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentDetails),
      }
    );
    if (response.status === 200) {
      console.log("success!");
    } else {
      console.log("there was an error");
    }
  }

  React.useEffect(() => {
    setInitialStudentDetails(props.selectedStudentDetails);
    setUpdatedStudentDetails(props.selectedStudentDetails);
  }, []);
  return updatedStudentDetails ? (
    <div className="studentDetailsGrid">
      <div className="studentDetailsRow">
        <b>First Name:</b>
        <TextField
          value={updatedStudentDetails.firstname}
          name="firstname"
          onChange={(e) => textFieldChangeHandler(e)}
        ></TextField>
      </div>
      <div className="studentDetailsRow">
        <b>Last Name:</b>
        <TextField
          value={updatedStudentDetails.lastname}
          name="lastname"
          onChange={(e) => textFieldChangeHandler(e)}
        ></TextField>
      </div>
      <div className="studentDetailsRow">
        <b>Student ID:</b>
        <TextField
          value={updatedStudentDetails.id}
          name="id"
          onChange={(e) => textFieldChangeHandler(e)}
        ></TextField>
      </div>
      <div className="studentDetailsRow">
        <b>Email:</b>
        <TextField
          value={updatedStudentDetails.email}
          name="email"
          onChange={(e) => textFieldChangeHandler(e)}
        ></TextField>
      </div>
      <div className="editMarksAndStudentDetailsButtonContainer">
        <Button
          variant="outlined"
          onClick={() => submitStudentDetailChanges(updatedStudentDetails)}
        >
          SAVE
        </Button>
        <Button onClick={() => props.setEditState(false)} variant="outlined">
          DISCARD
        </Button>
      </div>
    </div>
  ) : null;
};
