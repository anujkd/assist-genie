import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Activity,
  MessageSquare,
  Settings,
  Wrench,
  PlayCircle,
  ExternalLink,
  Users,
  Save,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // LLM Configuration State
  const [selectedLLMs, setSelectedLLMs] = useState<string[]>([]);
  const [geminiModel, setGeminiModel] = useState<string>('');
  const [chatGPTModel, setChatGPTModel] = useState<string>('');
  const [cloudProvider, setCloudProvider] = useState<string>('');

  const handleLLMChange = (llm: string) => {
    setSelectedLLMs(prev => {
      if (prev.includes(llm)) {
        if (llm === 'gemini') setGeminiModel('');
        if (llm === 'chatgpt') setChatGPTModel('');
        return prev.filter(item => item !== llm);
      }
      return [...prev, llm];
    });
  };

  const geminiModels = ['Gemini Pro', 'Gemini Ultra'];
  const chatGPTModels = ['GPT-3.5', 'GPT-4', 'GPT-4 Turbo'];

  const handleSave = () => {
    const configuration = {
      selectedLLMs,
      models: {
        gemini: geminiModel,
        chatgpt: chatGPTModel,
      },
      cloudProvider,
    };
    console.log('Saving configuration:', configuration);
  };

  const isFormValid = () => {
    if (selectedLLMs.length === 0) return false;
    if (!cloudProvider) return false;
    if (selectedLLMs.includes('gemini') && !geminiModel) return false;
    if (selectedLLMs.includes('chatgpt') && !chatGPTModel) return false;
    return true;
  };

  // Sample data for the area chart
  const requestData = [
    { name: 'Jan', requests: 400 },
    { name: 'Feb', requests: 300 },
    { name: 'Mar', requests: 600 },
    { name: 'Apr', requests: 800 },
    { name: 'May', requests: 500 },
    { name: 'Jun', requests: 700 },
    { name: 'Jul', requests: 900 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-background">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuration Settings
          </TabsTrigger>
          <TabsTrigger value="tooling" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Tooling Configuration
          </TabsTrigger>
          <TabsTrigger value="Workbench" className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            Workbench
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Cards in one row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Health Matrix Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Matrix</CardTitle>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">98%</div>
                <p className="text-xs text-muted-foreground">System performance is optimal</p>
              </CardContent>
            </Card>

            {/* Total Requests Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>

            {/* Subscriptions Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">345</div>
                <p className="text-xs text-muted-foreground">Active subscriptions</p>
              </CardContent>
            </Card>
          </div>

          {/* Request Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Request Trends</CardTitle>
              <CardDescription>Monthly request volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={requestData}>
                    <defs>
                      <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#requestGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent API Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Recent API Requests</CardTitle>
              <CardDescription>View upcoming and recent API activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">GET /api/endpoint</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date().toLocaleString()}
                      </div>
                    </div>
                    <div className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                      Success
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration">
          <div className="grid gap-6">
            {/* LLM Configuration Card */}
            <Card>
              <CardHeader>
                <CardTitle>LLM Configuration Settings</CardTitle>
                <CardDescription>Configure your LLM preferences and cloud provider</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {/* LLM Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">LLM Selection</h3>
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <Checkbox
                        id="gemini"
                        checked={selectedLLMs.includes('gemini')}
                        onCheckedChange={() => handleLLMChange('gemini')}
                      />
                      <Label htmlFor="gemini" className="font-medium">
                        Gemini
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <Checkbox
                        id="chatgpt"
                        checked={selectedLLMs.includes('chatgpt')}
                        onCheckedChange={() => handleLLMChange('chatgpt')}
                      />
                      <Label htmlFor="chatgpt" className="font-medium">
                        ChatGPT
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Model Selection */}
                {selectedLLMs.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Model Selection</h3>
                    <div className="grid gap-4 max-w-md">
                      {selectedLLMs.includes('gemini') && (
                        <div className="space-y-2">
                          <Label htmlFor="gemini-model" className="text-sm font-medium">
                            Gemini Model
                          </Label>
                          <Select value={geminiModel} onValueChange={setGeminiModel}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Gemini model" />
                            </SelectTrigger>
                            <SelectContent>
                              {geminiModels.map(model => (
                                <SelectItem key={model} value={model}>
                                  {model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {selectedLLMs.includes('chatgpt') && (
                        <div className="space-y-2">
                          <Label htmlFor="chatgpt-model" className="text-sm font-medium">
                            ChatGPT Model
                          </Label>
                          <Select value={chatGPTModel} onValueChange={setChatGPTModel}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select ChatGPT model" />
                            </SelectTrigger>
                            <SelectContent>
                              {chatGPTModels.map(model => (
                                <SelectItem key={model} value={model}>
                                  {model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cloud Provider Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Cloud Provider</h3>
                  <RadioGroup
                    value={cloudProvider}
                    onValueChange={setCloudProvider}
                    className="grid grid-cols-3 gap-4 max-w-md"
                  >
                    {['gcp', 'azure', 'aws'].map(provider => (
                      <div
                        key={provider}
                        className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <RadioGroupItem value={provider} id={provider} />
                        <Label htmlFor={provider} className="font-medium">
                          {provider.toUpperCase()}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Save Button */}
                <div className="max-w-md">
                  <Button className="w-full" onClick={handleSave} disabled={!isFormValid()}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Configuration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Settings</CardTitle>
                <CardDescription>Configure additional settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Additional configuration options will appear here
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tooling">
          <Card>
            <CardHeader>
              <CardTitle>Tooling Configuration</CardTitle>
              <CardDescription>Configure your development tools and integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Tooling configuration content goes here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Workbench">
          <Card>
            <CardHeader>
              <CardTitle>Workbench</CardTitle>
              <CardDescription>Test and experiment with your APIs</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Workbench content goes here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
