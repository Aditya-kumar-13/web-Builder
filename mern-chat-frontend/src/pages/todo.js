import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Input, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Grid } from "antd";
import "./todo.css";

const Todo = ({ socket }) => {
	const { Title } = Typography;
	const screen = Grid.useBreakpoint();
	const [task, setTask] = useState("");
	const [deadline,setDeadline] = useState(null);
	const [taskList, setTaskList] = useState([]);

	const addTask = () => {
		if (task.trim()) {
			socket.emit("addTask", { task,deadline });
			setTask("");
			setDeadline(null);
		}
	};

	const deleteTask = (taskId) => {
		socket.emit("deleteTask", taskId);
	};

	useEffect(() => {
		socket.on("allTasks", (tasks) => {
			setTaskList(tasks);
		});

		// Clean up when component unmounts
		return () => socket.off("allTasks");
	}, [socket]);

	return (
		
		<div className="main">
			<div className="App">
				{/* Main Row to hold both inputTask and taskList side by side */}
				<Row gutter={24} className="main-row">
					<Col className="inputTask" xs={24} md={12}>
						<Row className="Rows">
							<Title level={2} style={{ color: "#9B59B6", margin: "1rem" }}>
								Task Manager
							</Title>
						</Row>
						<Row className="Rows" gutter={12}>
							<Col xs={24}>
								<Row>
									<label>Task:</label><br />
									<Input
										className="search"
										placeholder="Task"
										value={task}
										onChange={(event) => setTask(event.target.value)}
									/>
								</Row>
								<Row style={{ marginTop: "1rem" }}>
									<label>Deadline:</label><br />
									<Input
										type="date"
										className="search"
										value={deadline}
										onChange={(event) => setDeadline(event.target.value)}
									/>
								</Row>
								<Row style={{ marginTop: "1rem" }}>
									<Button
										onClick={addTask}
										style={{
											color: "white",
											backgroundColor: "#9B59B6",
											height: "2rem",
											borderRadius: "5px",
											width: "100%",
											border: "none",
										}}
									>
										Add Task
									</Button>
								</Row>
							</Col>
						</Row>
					</Col>

					{/* Task list column */}
					<Col className="taskList" xs={24} md={12}>
						<Row className="todo">
							<Col className="task-list-container">
								{taskList.map((item) => (
									<Row
										key={item._id}
										gutter={12}
										justify={"space-between"}
										className="task-row"
										style={{ marginBottom: "1rem" }}
									>
										<Col className="task-text">{item.task}</Col>
										<Col>{new Date(item.deadline).toLocaleDateString()}</Col>
										<Col>
											<Button
												className="complete"
												onClick={() => deleteTask(item._id)}
												style={{ width: "100%" }}
											>
												<CheckCircleOutlined />
											</Button>
										</Col>
									</Row>
								))}
							</Col>
						</Row>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default Todo;
