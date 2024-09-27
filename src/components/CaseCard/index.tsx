import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { CaseCardProps } from '../../interfaces'

import './style.css';



const CaseCard: React.FC<CaseCardProps> = ({ caseItem, index }) => (
    <Draggable draggableId={caseItem.caseId} index={index}>
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
);

export default CaseCard;
