import React from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { TextField, Button } from "@mui/material";

export const SummaryHome = (props: {}) => {
  type Params = {
    user: string;
    classID: string;
  };
  const { user, classID } = useParams<keyof Params>() as Params;

  const { data, error, mutate, isValidating } = useSWR(
    `http://localhost:8000/${user}/${classID}/summary`
  );

  type AssignmentData = {
    name: string;
    weight: number;
  };
  const [assignmentsData, setAssignmentsData] = React.useState<
    AssignmentData[]
  >([]);

  const [updatedAssignmentsData, setUpdatedAssignmentsData] = React.useState<
    AssignmentData[]
  >([]);

  function textFieldChangeHandler(event: any) {
    setAssignmentsData([...assignmentsData]);
  }

  React.useEffect(() => {
    setAssignmentsData([]);
    if (data) {
      let assignmentArray: AssignmentData[] = [];
      data.forEach((datum: any) => {
        if (datum.assignments) {
          assignmentArray.push({
            name: datum.assignments,
            weight: datum.assignment_weight,
          });
        }
      });
      setAssignmentsData(assignmentArray);
    }
  }, [data]);

  if (error) {
    console.log(error);
  }

  const [selectedAssignment, setSelectedAssignment] =
    React.useState<string>("");

  return (
    <div className="summaryPanel">
      <div className="summaryRow">
        <div className="summaryColumn">
          <b>Assignment Name</b>
        </div>
        <div className="summaryColumn">
          <b>Weight</b>
        </div>
        <div className="summaryColumn">
          <b>Class Median</b>
        </div>
      </div>
      <Button
        onClick={() => {
          console.log(assignmentsData);
        }}
      >
        CLICK
      </Button>
      {data ? (
        assignmentsData.map((entry: any, index: number) => {
          if (entry.name) {
            return (
              <div
                className={
                  selectedAssignment === entry.name
                    ? "summaryRow summarySelected"
                    : "summaryRow"
                }
                key={entry.name}
                onClick={() => setSelectedAssignment(entry.name)}
              >
                <div className="summaryColumn">{entry.name}</div>
                <div className="summaryColumn">
                  <TextField
                    id={`${index}`}
                    value={entry.weight ? entry.weight : ""}
                    onChange={(event) => {
                      setAssignmentsData((prev: any) =>
                        prev.map((dataPoint: any, index: number) => {
                          if (isNaN(parseInt(event.target.value))) {
                            return {
                              ...dataPoint,
                              weight: null,
                            };
                          }
                          if (index !== parseInt(event.target.id)) {
                            return dataPoint;
                          } else {
                            return {
                              ...dataPoint,
                              weight: parseInt(event.target.value),
                            };
                          }
                        })
                      );
                    }}
                  ></TextField>
                </div>
                <div className="summaryColumn"></div>
              </div>
            );
          }
        })
      ) : (
        <h1>{error ? "There was an error." : "Loading..."}</h1>
      )}
    </div>
  );
};
