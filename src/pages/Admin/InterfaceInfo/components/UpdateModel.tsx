import { ProColumns, ProTable } from '@ant-design/pro-components';
import Modal from 'antd/es/modal/Modal';
import React, { createRef, useEffect, useRef } from 'react';

export type Props = {
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo) => Promise<void>;
  visible: boolean;
  values: API.InterfaceInfo;
};

const UpdateModel: React.FC<Props> = (props) => {
  const { columns, values, visible, onCancel, onSubmit } = props;

  const formRef = useRef<any>();
  useEffect(() => {
    formRef.current?.setFieldsValue(values);
  }, [values]);
  return (
    <>
      <Modal visible={visible}  footer={null} onCancel={() => onCancel?.()}>
        <ProTable
          type="form"
          formRef={formRef}
          columns={columns}
          onSubmit={async (value) => {
            onSubmit?.(value);
          }}
          form={{
            initialValues: values,
          }}
        ></ProTable>
      </Modal>
    </>
  );
};

export default UpdateModel;
