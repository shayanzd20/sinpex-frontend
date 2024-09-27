import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult, Droppable, Draggable } from 'react-beautiful-dnd';
import { Project, ColumnProps, CaseCardProps } from '../../interfaces'
import { mockProject, generateRandomId } from '../../mocks/mockProject'
import { FaEdit, FaEllipsisV } from 'react-icons/fa'; 
import axios from 'axios';
import './style.css';

// Column Component
const Column: React.FC<ColumnProps> = ({ column, sortColumn, updateColumnTitle, deleteColumn, addCaseToColumn }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(column.name);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    console.log('column :>> ', column);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.target.value);
    };

    const handleSaveTitle = () => {
        updateColumnTitle(column.columnId, newTitle);
        setIsEditing(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (!event.target) return;

        // Check if the clicked element is not inside the dropdown menu
        if (!(event.target as HTMLElement).closest('.dropdown-menu')) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);
    
    return (
        <div className="column">
            <div className="column-header">
                {isEditing ? (
                    <div>
                        <input 
                            type="text" 
                            value={newTitle} 
                            onChange={handleTitleChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveTitle();
                            }}
                        />
                        <button onClick={handleSaveTitle}>Save</button>
                    </div>
                ) : (
                    <div className="column-title">
                        <h3>{column.name}</h3>
                        <button onClick={() => setIsEditing(true)} className="edit-button">
                            <FaEdit />
                        </button>
                    </div>
                )}
                 {/* Icon Button with Dropdown */}
                 <div className="column-menu">
                    <button className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <FaEllipsisV />
                    </button>
                    {isMenuOpen && (
                        <div className="dropdown-menu">
                            <button onClick={() => { sortColumn(column.columnId); setIsMenuOpen(false); }}>
                                Sort by Title
                            </button>
                            <button onClick={() => { deleteColumn(column.columnId); setIsMenuOpen(false); }}>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Droppable droppableId={column.columnId}>
                {(provided) => (
                    <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef} 
                    className="case-list" 
                    >
                        {column.cases.map((caseItem, index) => {
                            console.log('caseItem, index in Column:>> ', caseItem, index);
                            return(
                            <CaseCard key={caseItem.caseId} caseItem={caseItem} index={index} />
                        )})}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            {/* Create Case Button */}
            <button className="create-case-button" onClick={() => addCaseToColumn(column.columnId)}>
                + Create Case
            </button>
        </div>
    );
};

// CaseCard Component
const CaseCard: React.FC<CaseCardProps> = ({ caseItem, index }) => {
    
    console.log('caseItem, index in CaseCard:>> ', caseItem, index);
    return(
    <Draggable draggableId={caseItem.caseId} index={index} key={caseItem.caseId}>
        {(provided) => (
            <div
                className="case-card"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                <h4>{caseItem.title}</h4>
                <div className="progress-bar">
                    <span style={{ width: `${caseItem.progress}%` }} />
                </div>
                <p>Updated {caseItem.updatedAt}</p>
            </div>
        )}
    </Draggable>
)};

// KanbanBoard Component
const KanbanBoard: React.FC = () => {
    const [project, setProject] = useState<Project | null>(null);
    const [sortedColumns, setSortedColumns] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
       
        axios.get<Project>('http://localhost:8080/api/v1/project') 
            .then(response => {

                console.log('response.data :>> ', response.data);
                setProject(response.data || mockProject)
            });
        // setProject(mockProject); // Using mock data
    }, []);

    useEffect(() => {
        if (project) {
            axios.post<Project>('http://localhost:8080/api/v1/project', {project: project})
                .then(response => {
                    console.log('Project posted successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error posting project:', error);
                });
        }
    }, [project]); // Only run when the project changes

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination || !project) return;
    
        const { source, destination } = result;
    
        const updatedProject = { ...project };
        const sourceColumn = updatedProject.columns.find(col => col.columnId === source.droppableId);
        const destinationColumn = updatedProject.columns.find(col => col.columnId === destination.droppableId);
    
        if (!sourceColumn || !destinationColumn) return;
    
        const [movedCase] = sourceColumn.cases.splice(source.index, 1); // Remove case from source
    
        if (source.droppableId === destination.droppableId) {
          // Move within the same column
          sourceColumn.cases.splice(destination.index, 0, movedCase);
        } else {
          // Move between different columns
          destinationColumn.cases.splice(destination.index, 0, movedCase);
        }
    
        setProject(updatedProject); 
      };

    const sortColumn = (columnId: string) => {
        if (!project) return;

        const updatedProject = { ...project };
        const column = updatedProject.columns.find(col => col.columnId === columnId);

        if (column) {
            // Toggle the sorting state for this column
            const isSorted = sortedColumns[columnId];
            column.cases.sort((a, b) => {
                if (isSorted) return a.title.localeCompare(b.title); // Sort ascending
                return b.title.localeCompare(a.title); // Sort descending when clicked again
            });

            // Update the sorted state
            setSortedColumns({
                ...sortedColumns,
                [columnId]: !isSorted,
            });

            setProject(updatedProject);
        }
    };

    const updateColumnTitle = (columnId: string, newTitle: string) => {
        if (!project) return;

        const updatedProject = { ...project };
        const column = updatedProject.columns.find(col => col.columnId === columnId);
        if (column) {
            column.name = newTitle;
            setProject(updatedProject); 
        }
    };

    const addColumn = () => {
        if (!project) return;

        // just to avoid make it ugly
        if(project.columns.length<8){
            const newColumn = {
                columnId: generateRandomId(), 
                name: `New Column ${project.columns.length + 1}`, 
                cases: [] 
            };
    
            const updatedProject = {
                ...project,
                columns: [...project.columns, newColumn] 
            };
    
            setProject(updatedProject);
        }
    };

    const deleteColumn = (columnId: string) => {
        if (!project) return;

        const updatedProject = {
            ...project,
            columns: project.columns.filter(column => column.columnId !== columnId)
        };

        setProject(updatedProject);
    };

    const addCaseToColumn = (columnId: string) => {
        if (!project) return;

        const updatedProject = { ...project };
        const column = updatedProject.columns.find(col => col.columnId === columnId);
        
        if (column) {
            const newCase = {
                caseId: generateRandomId(),
                title: `Case ${column.cases.length + 1}`,
                progress: 0,
                updatedAt: new Date().toISOString().split('T')[0]
            };
            column.cases.push(newCase);
        }

        setProject(updatedProject); 
    };

    return project ? (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="kanban-board">
                {project.columns.map((column) => (
                    <Column 
                        key={column.columnId} 
                        column={column} 
                        sortColumn={sortColumn} 
                        updateColumnTitle={updateColumnTitle} 
                        deleteColumn={deleteColumn}
                        addCaseToColumn={addCaseToColumn}
                    />
                ))}
                <button className="add-column" onClick={addColumn}>+</button> 
            </div>
        </DragDropContext>
    ) : <p>Loading...</p>;
};

export default KanbanBoard;
