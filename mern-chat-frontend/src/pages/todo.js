// import { Row, Col, Title, Typography, Input, Button, Card } from "antd";
// import { CheckCircleOutlined } from "@ant-design/icons";
// import io from "socket.io-client";
// import { Grid } from "antd";
// import { useEffect, useState } from "react";
// import Item from "antd/es/list/Item";
// const Todo = ({ socket }) => {
// 	const { Title } = Typography;
// 	const screen = Grid.useBreakpoint();
// 	const [task, setTask] = useState([]);
// 	const [taskList, setTaskList] = useState([]);

// 	const addTask = () => {
// 		socket.emit("addTask", { task });
// 		setTask("");
// 	};

// 	useEffect(() => {
// 		socket.on("allTasks", (tasks) => {
// 			setTaskList(tasks);
// 		});

// 		// Clean up when component unmounts
// 		return () => socket.off("allTasks");
// 	}, []);
// 	return (
// 		<div className="main">
// 			<div className="App">
// 				<Col xs={24} md={24}>
// 					<Row className="Rows">
// 						<Title level={2} style={{ color: "blue", margin: "1rem" }}>
// 							Task Manager
// 						</Title>
// 					</Row>
// 					<Row xs={12} md={12} className="Rows" gutter={12}>
// 						<Col xs={16} md={16} className="Cols">
// 							<Input
// 								placeholder="Task"
// 								onChange={(event) => {
// 									setTask(event.target.value);
// 								}}
// 							/>
// 						</Col>
// 						<Col xs={6} md={6} className="Cols">
// 							<Button
// 								onClick={addTask}
// 								style={{
// 									backgroundColor: "blue",
// 									height: "2rem",
// 									borderRadius: "5px",
// 									width: "100%",
// 								}}
// 							>
// 								Add Task
// 							</Button>
// 						</Col>
// 					</Row>
// 					<Row className="todo">
// 						<Col>
// 							{taskList.map((item) => (
// 								<Row span={24} key={item._id} gutter={12} justify={"space-between"}>
// 									<Col>{item.task}</Col>

// 									<Col>
// 										<Button
// 											// onClick={() => deleteTask(item._id)}
// 											style={{ width: "100%" }}
// 										>
// 											<CheckCircleOutlined />
// 										</Button>
// 									</Col>
// 								</Row> // Render task as string
// 							))}
// 						</Col>
// 					</Row>
// 				</Col>
// 			</div>
// 		</div>
// 	);
// };

// export default Todo;
import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Input, Button } from "antd";
import { CheckCircleOutlined, StarOutlined ,StarFilled} from "@ant-design/icons";
import { Grid } from "antd";
import "./todo.css";

const Todo = ({ socket }) => {
	const { Title } = Typography;
	const screen = Grid.useBreakpoint();
	const [task, setTask] = useState("");
	const [deadline,setDeadline] = useState(null);
	const [taskList, setTaskList] = useState([]);
	const [isImportant,setIsImportant] = useState(false);
	const addTask = () => {
		if (task.trim()) {
			socket.emit("addTask", { task,deadline });
			setTask("");
			setDeadline(null);
		}
	};

	const toggleImportant = (taskId, currentImportantStatus) => {
		const newImportantStatus = !currentImportantStatus;
		console.log(`Task ID: ${taskId}, New Important Status: ${newImportantStatus}`);
		socket.emit("updateImportantStatus", { taskId, isImportant: newImportantStatus });
	};

	const deleteTask = (taskId) => {
		socket.emit("deleteTask", taskId);
	};

	useEffect(() => {
		socket.on("allTasks", (tasks) => {
			setTaskList(tasks.reverse());
		});

		// Clean up when component unmounts
		// return () => socket.off("allTasks");
	}, [socket]);

	return (
		<div className="main">
			<div className="App">
				<Col xs={24} md={24}>
					<Row className="Rows">
						<Title level={2} style={{ color: "#9B59B6", margin: "1rem" }}>
							Task Manager
						</Title>
					</Row>
					<Row xs={12} md={12} className="Rows" gutter={12}>
						<Col xs={16} md={16} className="Cols">
							<Row>
							<label>Task: </label><br></br>
								<Input
								className="search"
								placeholder="Task"
								value={task}
								onChange={(event) => setTask(event.target.value)}
							/>
							</Row>
							<Row>
								<label>Deadline: </label><br></br>
							<Input
							 	type="date"
								className="search"
								value={deadline}
								onChange={(event) => setDeadline(event.target.value)}
							/>
							</Row>
							<Row>
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
					<Row className="todo">
						<Col className="task-list-container">
							{" "}
							{/* Apply scrollable container */}
							{taskList.map((item) => (
								<Row span={24} key={item._id} gutter={12} justify={"space-between"}>
									<Col>{item.isImportant ? (
											<StarFilled
												style={{ color: "gold", cursor: "pointer" }}
												onClick={() => toggleImportant(item._id, item.isImportant)}
											/>
										) : (
											<StarOutlined
												style={{ color: "gray", cursor: "pointer" }}
												onClick={() => toggleImportant(item._id, item.isImportant)}
											/>
										)}</Col>
									<Col>{item.task}</Col>
								
									<Col>{new Date(item.deadline).toLocaleDateString() }</Col><br></br>
									<Col>
										<Button
											className="complete"
											onClick={() => deleteTask(item._id)}
											style={{ width: "100%" }}
										>
											<CheckCircleOutlined />
										</Button>
									</Col><br></br>
								</Row>
							))}
						</Col>
					</Row>
				</Col>
			</div>
		</div>
	);
};

export default Todo;
