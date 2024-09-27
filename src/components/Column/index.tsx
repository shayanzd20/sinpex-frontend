import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { ColumnProps } from '../../interfaces'
import CaseCard from '../CaseCard';
import './style.css';

const Column: React.FC<ColumnProps> = ({ column }) => {

    console.log('column :>> ', column);
    return(<div className="column">
        <div className="column-header">
            <h3>{column.name}</h3>
            <button>Edit</button>
        </div>
        <Droppable droppableId={column.columnId} key={column.name.toString()}>
            {(provided) => (
                <div className="case-list" ref={provided.innerRef} {...provided.droppableProps}>
                    {column.cases.map((caseItem, index) => (
                        <CaseCard key={caseItem.caseId} caseItem={caseItem} index={index} />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </div>)
};

export default Column;
