import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingGET,
  updateInterfaceInfoUsingPOST,
} from '@/services/gali-api/interfaceInfoController';
import CreateModel from '@/pages/InterfaceInfo/components/CreateModel';
import UpdateModel from '@/pages/InterfaceInfo/components/UpdateModel';

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      await addInterfaceInfoUsingPOST({ ...fields });
      hide();
      message.success('创建成功');
      handleModalOpen(false);
      return true;
    } catch (error: any) {
      hide();
      message.error('创建失败', error.message);
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('修改中');
    try {
      await updateInterfaceInfoUsingPOST({
        ...fields,
      });
      hide();

      message.success('更新成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('更新失败', error.data);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await deleteInterfaceInfoUsingPOST({
        id: selectedRows.id,
      });
      hide();
      message.success('删除成功');
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败', error.data);
      return false;
    }
  };

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.updateForm.ruleName.nameLabel"
          defaultMessage="id"
        />
      ),
      dataIndex: 'id',
      valueType: 'text',
      readonly: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.updateForm.ruleName.nameLabel"
          defaultMessage="接口名称"
        />
      ),
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleDesc" defaultMessage="描述" />,
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleCallNo" defaultMessage="请求方法" />,
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleCallNo" defaultMessage="请求头" />,
      dataIndex: 'requestHeader',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleCallNo" defaultMessage="请求参数" />,
      dataIndex: 'requestParams',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleCallNo" defaultMessage="接口地址" />,
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleCallNo" defaultMessage="响应头" />,
      dataIndex: 'responseHeader',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="状态" />,
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.default" defaultMessage="关闭" />
          ),
          status: 'Default',
        },
        1: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.running" defaultMessage="开启" />
          ),
          status: 'Processing',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleCallNo" defaultMessage="创建时间" />,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleCallNo" defaultMessage="更新时间" />,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="修改" />
        </a>,
        <a
          key="subscribeAlert"
          onClick={() => {
            handleRemove(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.subscribeAlert" defaultMessage="发布/下架" />
        </a>,
      ],
    },
  ];

  const intl = useIntl();

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: '接口详情',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined />{' '}
            <FormattedMessage id="pages.searchTable.new" defaultMessage="新建接口" />
          </Button>,
        ]}
        request={async (params, sort: any, filter: Record<string, React.ReactText[] | null>) => {
          const res = await listInterfaceInfoByPageUsingGET({
            ...params,
          });
          if (res?.data) {
            return {
              data: res?.data.records || [],
              success: true,
              total: res?.data.total || 0,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <UpdateModel
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalOpen}
        values={currentRow || {}}
        columns={columns}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <CreateModel
        columns={columns}
        onCancel={() => {
          handleModalOpen(false);
        }}
        onSubmit={(values) => {
          return handleAdd(values);
        }}
        visible={createModalOpen}
      />
    </PageContainer>
  );
};

export default TableList;
